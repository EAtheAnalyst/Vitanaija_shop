import { z } from "zod";
import type { Product } from "@/content/types";
import { getProducts } from "@/lib/catalog";
import { store, type CartItem, type SavedCart } from "@/lib/db";
import { apiError, getApiUser, json, unauthorized } from "@/lib/api";

// The signed-in customer's cart, shared by the website and the app.
// Clients merge their local cart with this on sign-in, then PUT the whole cart after every change.

const body = z.object({
  items: z.array(z.object({ slug: z.string().min(1).max(80), qty: z.number().int().min(0).max(20) })).max(30),
});

async function hydrate(cart: SavedCart) {
  const products = await getProducts();
  const items = cart.items
    .map((i) => ({ ...i, product: products.find((p) => p.slug === i.slug) }))
    .filter((i): i is CartItem & { product: Product } => Boolean(i.product));
  return { items, updatedAt: cart.updatedAt };
}

export async function GET(req: Request) {
  const user = await getApiUser(req);
  if (!user) return unauthorized();
  return json(await hydrate(await store.getCart(user.email)));
}

export async function PUT(req: Request) {
  const user = await getApiUser(req);
  if (!user) return unauthorized();
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return apiError(400, "Invalid cart.");

  // Merge duplicate lines, drop zero quantities and products that no longer exist.
  const known = new Set((await getProducts()).map((p) => p.slug));
  const merged = new Map<string, number>();
  for (const { slug, qty } of parsed.data.items) {
    if (qty > 0 && known.has(slug)) merged.set(slug, Math.min(20, (merged.get(slug) ?? 0) + qty));
  }
  const saved = await store.saveCart(user.email, [...merged].map(([slug, qty]) => ({ slug, qty })));
  return json(await hydrate(saved));
}
