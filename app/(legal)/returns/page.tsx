import type { Metadata } from "next";
import { DELIVERY_FEE_LAGOS, DELIVERY_FEE_OTHER, FREE_DELIVERY_FROM } from "@/content/delivery";
import { formatNaira } from "@/lib/format";
import { brand } from "@/content/brand";
import { PageHero, Prose } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Returns & Delivery" };

export default function ReturnsPage() {
  return (
    <>
      <PageHero eyebrow="Help" title="Returns & Delivery" />
      <Prose>
        <h2>Delivery</h2>
        <ul>
          <li>We deliver to all 36 states and the FCT.</li>
          <li>Lagos: {formatNaira(DELIVERY_FEE_LAGOS)}, usually 1–2 working days.</li>
          <li>Other states: {formatNaira(DELIVERY_FEE_OTHER)}, usually 3–5 working days.</li>
          <li>Free delivery on orders over {formatNaira(FREE_DELIVERY_FROM)}.</li>
        </ul>
        <h2>Pay on delivery</h2>
        <p>Pay the rider by cash, card (POS) or bank transfer. Please check your items before paying.</p>
        <h2>30-day money-back promise</h2>
        <p>If you're not happy for any reason, contact {brand.email.info} within 30 days of delivery. We'll arrange collection and refund you by bank transfer within 7 working days of receiving the return.</p>
      </Prose>
    </>
  );
}
