import "server-only";
import { cache } from "react";
import { products as seedProducts } from "@/content/products";
import { sampleReviews } from "@/content/reviews";
import type { Product, Review } from "@/content/types";
import { store } from "@/lib/db";
import { isProd } from "@/lib/env";

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const list = await store.listProducts();
    return list.length ? list : seedProducts;
  } catch (err) {
    console.error("[catalog] falling back to seed products", err);
    return seedProducts;
  }
});

export const getProduct = cache(async (slug: string) => (await getProducts()).find((p) => p.slug === slug) ?? null);

export async function getProductsBySlug(slugs: string[]) {
  const all = await getProducts();
  return slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is Product => Boolean(p));
}

/** Approved reviews. In development, sample reviews fill in so the layout can be seen. */
export const getReviews = cache(async (): Promise<Review[]> => {
  let reviews: Review[] = [];
  try {
    reviews = await store.listApprovedReviews();
  } catch (err) {
    console.error("[catalog] could not load reviews", err);
  }
  if (reviews.length || isProd) return reviews;
  return sampleReviews;
});
