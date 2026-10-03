import { store } from "@/lib/db";
import { apiError, json } from "@/lib/api";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Order IDs are unguessable UUIDs, the same rule as the web order page (/order/[id]).
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return apiError(404, "Order not found.");
  const order = await store.getOrder(id);
  return order ? json({ order }) : apiError(404, "Order not found.");
}
