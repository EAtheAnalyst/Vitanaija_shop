import { getProduct } from "@/lib/catalog";
import { apiError, json } from "@/lib/api";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  return product ? json({ product }) : apiError(404, "Product not found.");
}
