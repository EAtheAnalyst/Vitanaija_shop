import { store } from "@/lib/db";
import { placeOrder } from "@/lib/orders";
import { apiError, getApiUser, json, unauthorized } from "@/lib/api";

/** Place an order (guest or signed in). Body matches the web checkout: name, email, phone, address, city, state, notes, cart. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return apiError(400, "Send the order as JSON.");
  const user = await getApiUser(req);
  const result = await placeOrder(body, user?.email);
  if (!result.ok) return apiError(result.status, result.message, { fields: result.fields });
  return json({ order: result.order }, 201);
}

/** The signed-in customer's orders (same list as /account on the website). */
export async function GET(req: Request) {
  const user = await getApiUser(req);
  if (!user) return unauthorized();
  const orders = await store.listOrdersByEmail(user.email);
  return json({ orders });
}
