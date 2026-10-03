import "server-only";
import { randomInt } from "node:crypto";
import { z } from "zod";
import { NIGERIAN_STATES, deliveryFee } from "@/content/delivery";
import { getProducts } from "@/lib/catalog";
import { store, type Order } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

// One place that validates, prices and saves an order. Used by the web checkout
// (server action) and the mobile app (POST /api/v1/orders), so both always agree.

export type OrderField = "name" | "email" | "phone" | "address" | "city" | "state" | "cart";

export type PlaceOrderResult =
  | { ok: true; order: Order }
  | { ok: false; status: 400 | 409 | 500; message: string; fields?: Partial<Record<OrderField, string>> };

const phone = z
  .string()
  .transform((s) => s.replace(/[\s()-]/g, ""))
  .refine((s) => /^(\+?234|0)[789][01]\d{8}$/.test(s), "Enter a Nigerian mobile number, e.g. 0803 123 4567.");

const cartLines = z
  .array(z.object({ slug: z.string().min(1).max(80), qty: z.number().int().min(1).max(20) }))
  .min(1, "Your cart is empty.")
  .max(30);

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(80),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  phone,
  address: z.string().trim().min(5, "Please enter your street address.").max(160),
  city: z.string().trim().min(2, "Please enter your city or town.").max(60),
  state: z.enum(NIGERIAN_STATES, { errorMap: () => ({ message: "Please choose your state." }) }),
  notes: z.string().trim().max(300).optional().default(""),
  cart: cartLines,
});

export type OrderInput = z.input<typeof orderSchema>;

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const orderNumber = () => `VN-${Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")}`;

/** @param signedInEmail email of the signed-in customer (web session or app token), if any */
export async function placeOrder(raw: unknown, signedInEmail?: string | null): Promise<PlaceOrderResult> {
  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Partial<Record<OrderField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as OrderField;
      fields[key] ??= issue.message;
    }
    return { ok: false, status: 400, message: "Please check the highlighted fields.", fields };
  }
  const input = parsed.data;

  // Prices and stock always come from the catalogue, never from the client.
  const catalogue = await getProducts();
  const merged = new Map<string, number>();
  for (const line of input.cart) merged.set(line.slug, Math.min(20, (merged.get(line.slug) ?? 0) + line.qty));

  const items = [];
  for (const [slug, quantity] of merged) {
    const p = catalogue.find((x) => x.slug === slug);
    if (!p) return { ok: false, status: 409, message: "An item in your cart is no longer available. Please remove it and try again.", fields: { cart: "unavailable" } };
    if (!p.inStock) return { ok: false, status: 409, message: `${p.name} is sold out. Please remove it from your cart to continue.`, fields: { cart: "sold out" } };
    items.push({ slug, name: `${p.name} ${p.subtitle}`.trim(), unitPrice: p.price, quantity });
  }

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.quantity, 0);
  const fee = deliveryFee(input.state, subtotal);

  try {
    const customerId = await store.findCustomerId(signedInEmail ?? input.email);
    const order = await store.createOrder({
      number: orderNumber(),
      customerId,
      email: input.email,
      name: input.name,
      phone: input.phone,
      addressLine1: input.address,
      city: input.city,
      state: input.state,
      notes: input.notes,
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      items,
    });

    // The order is saved even if the email fails; the failure is logged for follow-up.
    try {
      if (await sendOrderConfirmation(order)) await store.markOrderEmailed(order.id);
    } catch (err) {
      console.error("[orders] confirmation email failed", err);
    }

    // A placed order empties the customer's synced cart on every device.
    if (signedInEmail) await store.saveCart(signedInEmail, []).catch(() => undefined);

    return { ok: true, order };
  } catch (err) {
    console.error("[orders] could not create order", err);
    return { ok: false, status: 500, message: "We couldn't place your order just now. Please try again in a moment." };
  }
}
