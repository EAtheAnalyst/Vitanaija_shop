import { brand, nav } from "@/content/brand";
import { home } from "@/content/home";
import { goals } from "@/content/products";
import { DELIVERY_FEE_LAGOS, DELIVERY_FEE_OTHER, FREE_DELIVERY_FROM, NIGERIAN_STATES, deliveryEstimate } from "@/content/delivery";
import { getReviews } from "@/lib/catalog";
import { json } from "@/lib/api";

// Everything the app needs to render its screens, from the same content files as the website.
// Edit content/ once and both web and mobile update.
export async function GET() {
  const reviews = await getReviews();
  return json(
    {
      brand,
      nav,
      home,
      goals,
      reviews,
      delivery: {
        freeFrom: FREE_DELIVERY_FROM,
        fees: { Lagos: DELIVERY_FEE_LAGOS, default: DELIVERY_FEE_OTHER },
        states: NIGERIAN_STATES.map((name) => ({ name, eta: deliveryEstimate(name) })),
      },
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
  );
}
