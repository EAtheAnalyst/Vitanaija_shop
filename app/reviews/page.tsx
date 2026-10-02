import type { Metadata } from "next";
import { home } from "@/content/home";
import { getReviews } from "@/lib/catalog";
import { PageHero } from "@/components/layout/PageHero";
import { Testimonials } from "@/components/sections/Testimonials";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return (
    <>
      <PageHero eyebrow="Reviews" title="What customers say" />
      {reviews.length ? (
        <Testimonials data={{ ...home.testimonials, viewAll: { label: "Shop now", href: "/shop" } }} reviews={reviews} />
      ) : (
        <section className="container-x py-24 text-center">
          <p className="text-body">Reviews from verified customers will appear here soon.</p>
          <ButtonLink href="/shop" className="mt-8">Shop now</ButtonLink>
        </section>
      )}
    </>
  );
}
