import Link from "next/link";
import type { Home, Product } from "@/content/types";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Carousel } from "@/components/ui/Carousel";
import { Reveal, RevealChild, RevealGroup } from "@/components/motion/Reveal";

export function BestSellers({ data, products }: { data: Home["bestSellers"]; products: Product[] }) {
  return (
    <section className="section-y bg-paper" aria-labelledby="best-sellers">
      <div className="container-x">
        <Reveal>
          <h2 id="best-sellers" className="h2 text-center">{data.title}</h2>
        </Reveal>
        <RevealGroup className="mt-14" stagger={150}>
          <Carousel label={data.title}>
            {products.map((p) => (
              <RevealChild key={p.slug}>
                <ProductCard product={p} />
              </RevealChild>
            ))}
          </Carousel>
        </RevealGroup>
        <Reveal className="mt-12 text-center" delay={200}>
          <Link href={data.viewAll.href} className="link-underline text-[12px] font-bold uppercase tracking-[0.08em] text-ink">
            {data.viewAll.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
