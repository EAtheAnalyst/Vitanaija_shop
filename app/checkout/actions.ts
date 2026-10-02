"use server";

import { randomInt } from "node:crypto";
import { z } from "zod";
import { auth } from "@/auth";
import { NIGERIAN_STATES, deliveryFee } from "@/content/delivery";
import { getProducts } from "@/lib/catalog";
import { store } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Partial<Record<FieldName, string>> }
  | { status: "ok"; orderId: string };

type FieldName = "name" | "email" | "phone" | "address" | "city" | "state" | "cart";

const phone = z
  .string()
  .transform((s) => s.replace(/[\s()-]/g, ""))
  .refine((s) => /^(\+?234|0)[789][01]\d{8}$/.test(s), "Enter a Nigerian mobile number, e.g. 0803 123 4567.");

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(80),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  phone,
  address: z.string().trim().min(5, "Please enter your street address.").max(160),
  city: z.string().trim().min(2, "Please enter your city or town.").max(60),
  state: z.enum(NIGERIAN_STATES, { errorMap: () => ({ message: "Please choose your state." }) }),
  notes: z.string().trim().max(300).optional().default(""),
  cart: z
    .string()
    .transform((s, ctx) => {
      try {
        return JSON.parse(s) as unknown;
      } catch {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Your cart could not be read." });
        return z.NEVER;
      }
    })
    .pipe(
      z
        .array(z.object({ slug: z.string().min(1).max(80), qty: z.number().int().min(1).max(20) }))
        .min(1, "Your cart is empty.")
        .max(30),
    ),
});

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const orderNumber = () => `VN-${Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")}`;

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fields: Partial<Record<FieldName, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as FieldName;
      fields[key] ??= issue.message;
    }
    return { status: "error", message: "Please check the highlighted fields.", fields };
  }
  const input = parsed.data;

  // Prices and stock always come from the catalogue, never from the browser.
  const catalogue = await getProducts();
  const merged = new Map<string, number>();
  for (const line of input.cart) merged.set(line.slug, Math.min(20, (merged.get(line.slug) ?? 0) + line.qty));

  const items = [];
  for (const [slug, quantity] of merged) {
    const p = catalogue.find((x) => x.slug === slug);
    if (!p) return { status: "error", message: "An item in your cart is no longer available. Please remove it and try again.", fields: { cart: "unavailable" } };
    if (!p.inStock) return { status: "error", message: `${p.name} is sold out. Please remove it from your cart to continue.`, fields: { cart: "sold out" } };
    items.push({ slug, name: `${p.name} ${p.subtitle}`.trim(), unitPrice: p.price, quantity });
  }

  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.quantity, 0);
  const fee = deliveryFee(input.state, subtotal);

  try {
    const session = await auth().catch(() => null);
    const customerId = session?.user?.email ? await store.findCustomerId(session.user.email) : await store.findCustomerId(input.email);

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
      console.error("[checkout] confirmation email failed", err);
    }

    return { status: "ok", orderId: order.id };
  } catch (err) {
    console.error("[checkout] could not create order", err);
    return { status: "error", message: "We couldn't place your order just now. Please try again in a moment." };
  }
}
