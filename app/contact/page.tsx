import type { Metadata } from "next";
import { brand } from "@/content/brand";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact us" title="We're here to help" intro="Questions about an order, a product or delivery? Send us a message and we'll reply within one working day." />
      <section className="container-x grid gap-14 py-20 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="space-y-6 text-[15px] text-body">
          <div><p className="font-semibold text-ink">Email</p><p>{brand.email.info}</p></div>
          <div><p className="font-semibold text-ink">Phone</p><p>{brand.phone}</p></div>
          <div><p className="font-semibold text-ink">Hours</p><p>Monday–Saturday, 8am–6pm WAT</p></div>
        </Reveal>
        <Reveal delay={120}><ContactForm /></Reveal>
      </section>
    </>
  );
}
