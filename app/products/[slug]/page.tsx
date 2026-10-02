import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brand } from "@/content/brand";
import { goals } from "@/content/products";
import { FREE_DELIVERY_FROM } from "@/content/delivery";
import { getProduct, getProducts } from "@/lib/catalog";
import { env } from "@/lib/env";
import { formatNaira } from "@/lib/format";
import { Bottle } from "@/components/art/Bottle";
import { ProductBuy } from "@/components/commerce/ProductBuy";
import { ProductCard } from "@/components/commerce/ProductCard";
import { BenefitIcon } from "@/components/ui/Icons";
import { Reveal, RevealChild, RevealGroup } from "@/components/motion/Reveal";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: `${p.name} ${p.subtitle}`, description: p.short } : { title: "Product not found" };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = (await getProducts()).filter((p) => p.slug !== slug).slice(0, 3);
  const goal = goals.find((g) => g.id === product.goal)?.label;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} ${product.subtitle}`,
    description: product.long,
    brand: { "@type": "Brand", name: brand.name },
    sku: product.slug,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${env.siteUrl}/products/${product.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-x grid gap-12 pb-24 pt-[120px] md:grid-cols-2 md:pt-[140px]">
        <Reveal className="relative grid aspect-[4/5] place-items-center bg-surface-1">
          <Bottle id={`pdp-${product.slug}`} name={product.name} subtitle={product.subtitle} tint={product.tint} count={product.count} className="h-[62%] drop-shadow-[0_28px_28px_rgba(11,66,80,0.14)]" />
          <span className="leaf absolute right-8 top-8 h-12 w-14 bg-accent-soft" aria-hidden />
        </Reveal>
        <Reveal className="flex flex-col gap-6 md:pt-6" delay={120}>
          <nav aria-label="Breadcrumb" className="text-[12px] text-muted">
            <Link href="/shop" className="hover:text-ink">Shop</Link> / <span>{goal}</span>
          </nav>
          <div>
            <h1 className="h2 md:!text-[48px]">{product.name}</h1>
            <p className="mt-2 text-[15px] text-body">{product.subtitle} · {product.size}</p>
          </div>
          <p className="text-[26px] text-ink">{formatNaira(product.price)}</p>
          <p className="max-w-[460px] text-[15px] leading-[1.75] text-body">{product.long}</p>
          <ProductBuy product={product} />
          <ul className="grid gap-3 border-y border-ink/10 py-5 text-[13px] text-ink sm:grid-cols-3">
            <li className="flex items-center gap-2"><span className="text-accent"><BenefitIcon name="cash" className="h-5 w-5" /></span>Pay on delivery</li>
            <li className="flex items-center gap-2"><span className="text-accent"><BenefitIcon name="truck" className="h-5 w-5" /></span>Free over {formatNaira(FREE_DELIVERY_FROM)}</li>
            <li className="flex items-center gap-2"><span className="text-accent"><BenefitIcon name="shield" className="h-5 w-5" /></span>30-day promise</li>
          </ul>
          <div className="divide-y divide-ink/10">
            <Details title="What's inside" open>
              <ul className="list-disc space-y-1 pl-5">{product.features.map((f) => <li key={f}>{f}</li>)}</ul>
            </Details>
            <Details title="How to take it">{product.usage}</Details>
            <Details title="Safety information">{product.warnings}</Details>
          </div>
        </Reveal>
      </section>
      <section className="bg-surface-2">
        <div className="container-x section-y">
          <Reveal><h2 className="h2">You might also like</h2></Reveal>
          <RevealGroup className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <RevealChild key={p.slug}><ProductCard product={p} /></RevealChild>)}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}

function Details({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group py-4" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium text-ink">
        {title}
        <span className="text-[20px] leading-none transition-transform duration-[280ms] ease-soft group-open:rotate-45" aria-hidden>+</span>
      </summary>
      <div className="pt-3 text-[14px] leading-[1.75] text-body">{children}</div>
    </details>
  );
}
