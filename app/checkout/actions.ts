"use server";

import { auth } from "@/auth";
import { placeOrder as place, type OrderField } from "@/lib/orders";

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Partial<Record<OrderField, string>> }
  | { status: "ok"; orderId: string };

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const raw = Object.fromEntries(formData) as Record<string, unknown>;
  let cart: unknown = [];
  try {
    cart = JSON.parse(String(raw.cart ?? "[]"));
  } catch {
    return { status: "error", message: "Your cart could not be read.", fields: { cart: "invalid" } };
  }

  const session = await auth().catch(() => null);
  const result = await place({ ...raw, cart }, session?.user?.email);
  return result.ok
    ? { status: "ok", orderId: result.order.id }
    : { status: "error", message: result.message, fields: result.fields };
}
