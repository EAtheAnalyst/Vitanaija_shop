import { getProducts } from "@/lib/catalog";
import { json } from "@/lib/api";

export async function GET() {
  const products = await getProducts();
  return json({ products }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" } });
}
