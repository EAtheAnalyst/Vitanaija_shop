import { home } from "@/content/home";
import { getProduct, getProducts, getProductsBySlug, getReviews } from "@/lib/catalog";
import { Hero, MissionStrip } from "@/components/sections/Hero";
import { BestSellers } from "@/components/sections/BestSellers";
import { About, Benefits, Guarantee } from "@/components/sections/Story";
import { Featured, Ingredients } from "@/components/sections/Showcase";
import { Testimonials } from "@/components/sections/Testimonials";
import { Newsletter } from "@/components/sections/Newsletter";

export default async function HomePage() {
  const [all, best, featured, reviews] = await Promise.all([
    getProducts(),
    getProductsBySlug(home.bestSellers.productSlugs),
    getProduct(home.featured.productSlug),
    getReviews(),
  ]);

  return (
    <>
      <Hero data={home.hero} />
      <MissionStrip text={home.mission} />
      <BestSellers data={home.bestSellers} products={best} />
      <About data={home.about} />
      <Benefits data={home.benefits} />
      <Guarantee data={home.guarantee} />
      {featured ? <Featured data={home.featured} product={featured} reviews={reviews} /> : null}
      <Ingredients data={home.ingredients} products={all} />
      {reviews.length ? <Testimonials data={home.testimonials} reviews={reviews} /> : null}
      <Newsletter data={home.newsletter} />
    </>
  );
}
