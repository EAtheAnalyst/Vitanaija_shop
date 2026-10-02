import type { Metadata } from "next";
import { DELIVERY_FEE_LAGOS, DELIVERY_FEE_OTHER, FREE_DELIVERY_FROM } from "@/content/delivery";
import { formatNaira } from "@/lib/format";
import { PageHero } from "@/components/layout/PageHero";
import { RevealChild, RevealGroup } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  { q: "How does pay on delivery work?", a: "Place your order online, and we call you to confirm it. When the rider arrives, you pay by cash, card (POS) or bank transfer. No card details are needed on the website." },
  { q: "Where do you deliver?", a: "We deliver to all 36 states and the FCT. Lagos orders usually arrive in 1–2 working days, and most other states in 3–5 working days." },
  { q: "How much is delivery?", a: `Delivery is free on orders over ${formatNaira(FREE_DELIVERY_FROM)}. Otherwise it costs ${formatNaira(DELIVERY_FEE_LAGOS)} in Lagos and ${formatNaira(DELIVERY_FEE_OTHER)} elsewhere.` },
  { q: "What if a product isn't right for me?", a: "Every order has a 30-day money-back promise. Contact us within 30 days of delivery and we'll arrange a refund." },
  { q: "Are your products NAFDAC registered?", a: "Every product goes through NAFDAC registration before sale. The registration number is printed on the label. [Confirm numbers before launch.]" },
  { q: "Can I take more than one supplement?", a: "Many people combine products, but please check with your doctor or pharmacist first, especially if you are pregnant, breastfeeding or taking medication." },
  { q: "Do I need an account to order?", a: "No. You can check out as a guest. Signing in with Google saves your details and lets you see past orders." },
];

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="FAQ" title="Questions, answered" />
      <RevealGroup className="container-x max-w-[820px] divide-y divide-ink/10 py-20" stagger={80}>
        {faqs.map((f) => (
          <RevealChild key={f.q}>
            <details className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[18px] text-ink">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-[18px] transition-transform duration-[280ms] ease-soft group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="max-w-[640px] pt-4 text-[15px] leading-[1.8] text-body">{f.a}</p>
            </details>
          </RevealChild>
        ))}
      </RevealGroup>
    </>
  );
}
