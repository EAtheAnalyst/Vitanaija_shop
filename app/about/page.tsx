import type { Metadata } from "next";
import { home } from "@/content/home";
import { PageHero } from "@/components/layout/PageHero";
import { About, Benefits } from "@/components/sections/Story";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Supplements built around Nigerian lives" intro="Balanced formulas, honest labels, and delivery to your door, with payment only when it arrives." />
      <About data={home.about} />
      <Benefits data={home.benefits} />
    </>
  );
}
