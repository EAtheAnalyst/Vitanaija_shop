import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { PageHero, Prose } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Terms & Conditions" };

// Placeholder terms: have a Nigerian lawyer review before launch.
export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" />
      <Prose>
        <p><strong>Draft: to be reviewed by a lawyer before launch.</strong></p>
        <h2>Orders</h2>
        <p>When you place an order, we call to confirm it before dispatch. We may cancel an order we cannot confirm or deliver.</p>
        <h2>Prices and payment</h2>
        <p>Prices are in Nigerian naira (₦) and include VAT where it applies. Payment is collected on delivery by cash, card (POS) or bank transfer.</p>
        <h2>Health information</h2>
        <p>Our products are food supplements, not medicines. They do not diagnose, treat, cure or prevent any disease. Consult a doctor before use if you are pregnant, breastfeeding, taking medication or have a medical condition.</p>
        <h2>Contact</h2>
        <p>{brand.name} · {brand.email.info}</p>
      </Prose>
    </>
  );
}
