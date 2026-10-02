import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Product, Review } from "@/content/types";
import { env } from "@/lib/env";
import type { Order, Store } from "./types";

let client: SupabaseClient | null = null;
const db = () =>
  (client ??= createClient(env.supabase.url, env.supabase.serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  }));

type ProductRow = {
  slug: string; name: string; subtitle: string; price: number; size: string; count: number;
  tint: Product["tint"]; goal: Product["goal"]; short: string; long: string; features: string[];
  usage: string; warnings: string; in_stock: boolean; best_seller: boolean;
};

const toProduct = (r: ProductRow): Product => ({
  slug: r.slug, name: r.name, subtitle: r.subtitle, price: r.price, size: r.size, count: r.count,
  tint: r.tint, goal: r.goal, short: r.short, long: r.long, features: r.features ?? [],
  usage: r.usage, warnings: r.warnings, inStock: r.in_stock, bestSeller: r.best_seller,
});

type OrderRow = {
  id: string; number: string; customer_id: string | null; email: string; name: string; phone: string;
  address_line1: string; city: string; state: string; notes: string; subtotal: number; delivery_fee: number;
  total: number; status: Order["status"]; payment_method: "pay_on_delivery"; email_sent_at: string | null;
  created_at: string;
  order_items: { product_slug: string; name: string; unit_price: number; quantity: number }[];
};

const ORDER_SELECT = "*, order_items(product_slug, name, unit_price, quantity)";

const toOrder = (r: OrderRow): Order => ({
  id: r.id, number: r.number, customerId: r.customer_id, email: r.email, name: r.name, phone: r.phone,
  addressLine1: r.address_line1, city: r.city, state: r.state, notes: r.notes ?? "",
  subtotal: r.subtotal, deliveryFee: r.delivery_fee, total: r.total, status: r.status,
  paymentMethod: r.payment_method, emailSentAt: r.email_sent_at, createdAt: r.created_at,
  items: (r.order_items ?? []).map((i) => ({ slug: i.product_slug, name: i.name, unitPrice: i.unit_price, quantity: i.quantity })),
});

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(`Supabase: ${res.error.message}`);
  return res.data;
}

export const supabaseStore: Store = {
  async listProducts() {
    const rows = check(await db().from("products").select("*").order("sort", { ascending: true }));
    return (rows as ProductRow[]).map(toProduct);
  },

  async getProduct(slug) {
    const row = check(await db().from("products").select("*").eq("slug", slug).maybeSingle());
    return row ? toProduct(row as ProductRow) : null;
  },

  async createOrder(o) {
    // create_order (supabase/schema.sql) inserts the order and its items in one transaction.
    const id = check(
      await db().rpc("create_order", {
        payload: {
          number: o.number, customer_id: o.customerId, email: o.email, name: o.name, phone: o.phone,
          address_line1: o.addressLine1, city: o.city, state: o.state, notes: o.notes,
          subtotal: o.subtotal, delivery_fee: o.deliveryFee, total: o.total,
          items: o.items.map((i) => ({ product_slug: i.slug, name: i.name, unit_price: i.unitPrice, quantity: i.quantity })),
        },
      }),
    ) as string;
    const order = await this.getOrder(id);
    if (!order) throw new Error("Order was created but could not be read back");
    return order;
  },

  async getOrder(id) {
    const row = check(await db().from("orders").select(ORDER_SELECT).eq("id", id).maybeSingle());
    return row ? toOrder(row as OrderRow) : null;
  },

  async listOrdersByEmail(email) {
    const rows = check(
      await db().from("orders").select(ORDER_SELECT).eq("email", email.toLowerCase()).order("created_at", { ascending: false }),
    );
    return (rows as OrderRow[]).map(toOrder);
  },

  async markOrderEmailed(id) {
    check(await db().from("orders").update({ email_sent_at: new Date().toISOString() }).eq("id", id));
  },

  async upsertCustomer(c) {
    const row = check(
      await db()
        .from("customers")
        .upsert(
          { email: c.email.toLowerCase(), name: c.name, image: c.image, google_id: c.googleId, last_sign_in_at: new Date().toISOString() },
          { onConflict: "email" },
        )
        .select("id")
        .single(),
    ) as { id: string };
    return row.id;
  },

  async findCustomerId(email) {
    const row = check(await db().from("customers").select("id").eq("email", email.toLowerCase()).maybeSingle()) as { id: string } | null;
    return row?.id ?? null;
  },

  async addSubscriber(email, source) {
    const { error } = await db().from("subscribers").insert({ email: email.toLowerCase(), source });
    if (!error) return "created";
    if (error.code === "23505") return "exists";
    throw new Error(`Supabase: ${error.message}`);
  },

  async addMessage(m) {
    check(await db().from("contact_messages").insert(m));
  },

  async listApprovedReviews() {
    const rows = check(
      await db().from("reviews").select("id, name, city, rating, text").eq("approved", true).order("created_at", { ascending: false }).limit(12),
    );
    return rows as Review[];
  },
};
