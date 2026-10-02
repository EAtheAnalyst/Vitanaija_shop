import Link from "next/link";
import type { Home, Product, Review } from "@/content/types";
import { Bottle } from "@/components/art/Bottle";
import { Texture } from "@/components/art/Texture";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight, Star } from "@/components/ui/Icons";
import { Reveal, RevealChild, RevealGroup } from "@/components/motion/Reveal";
import { formatNaira } from "@/lib/format";

export function Featured({ data, product, reviews }: { data: Home["featured"]; product: Product; reviews: Review[] }) {
  const real = reviews.filter((r) => !r.sample);
  const avg = real.length ? real.reduce((n, r) => n + r.rating, 0) / real.length : 0;
  return (
    <section className="bg-surface-2" aria-labelledby="featured">
      <div className="container-x grid items-center gap-16 pb-24 md:grid-cols-2 md:pb-32">
        <div className="relative mx-auto h-[400px] w-full max-w-[460px] sm:h-[360px]">
          <Reveal className="absolute left-0 top-6 grid aspect-square w-[min(280px,78%)] place-items-center rounded-full bg-surface-1">
            <Bottle id="featured" name={product.name} subtitle={product.subtitle} tint={product.tint} count={product.count} className="h-[107%] -translate-y-3 drop-shadow-[0_24px_24px_rgba(11,66,80,0.14)]" />
          </Reveal>
          <span className="leaf absolute left-[58%] top-0 h-14 w-[72px] bg-accent-soft" aria-hidden />
          <Reveal delay={180} className="absolute bottom-0 right-0 w-[min(220px,62%)] rounded-[24px] bg-paper p-6 shadow-[0_20px_50px_rgba(11,66,80,0.08)]">
            {real.length ? (
              <>
                <p className="text-[36px] leading-none text-ink">{real.length.toLocaleString("en-NG")}</p>
                <div className="mt-3 flex gap-0.5 text-star">{Array.from({ length: 5 }, (_, i) => <Star key={i} filled={i < Math.round(avg)} />)}</div>
                <p className="mt-2 text-[12px] text-body">Reviews from verified customers</p>
              </>
            ) : (
              <>
                <p className="text-[32px] leading-none text-ink">{formatNaira(product.price)}</p>
                <p className="mt-3 text-[12px] leading-relaxed text-body">{product.size} · pay when it arrives</p>
              </>
            )}
            <Link href={`/products/${product.slug}`} className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.08em] text-ink">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-paper"><ArrowRight className="h-2.5 w-2.5" /></span>
              View product
            </Link>
          </Reveal>
        </div>
        <Reveal className="space-y-5" delay={100}>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="featured" className="h2">{data.title}</h2>
          <p className="max-w-[380px] text-[15px] leading-[1.75] text-body">{data.body}</p>
          <div className="pt-2"><ButtonLink href={data.cta.href}>{data.cta.label}</ButtonLink></div>
        </Reveal>
      </div>
    </section>
  );
}

export function Ingredients({ data, products }: { data: Home["ingredients"]; products: Product[] }) {
  const nameOf = (slug: string) => {
    const p = products.find((x) => x.slug === slug);
    return p ? `${p.name} ${p.subtitle === "Complex" ? "Complex" : ""}`.trim() : slug;
  };
  const [a, b, ...rest] = data.cards;
  const Card = ({ c }: { c: (typeof data.cards)[number] }) => (
    <RevealChild className="relative min-h-[170px] overflow-hidden rounded-[8px] bg-surface-2 p-6 md:min-h-[176px]">
      <h3 className="text-[19px] font-medium text-ink">{c.name}</h3>
      <p className="mt-2 max-w-[60%] text-[13px] text-body">{c.form}</p>
      <Link href={`/products/${c.productSlug}`} className="absolute bottom-6 left-6 z-10 text-[11px] font-semibold text-ink underline underline-offset-4 hover:no-underline">
        {nameOf(c.productSlug)}
      </Link>
      <Texture kind={c.texture} />
    </RevealChild>
  );
  return (
    <section className="bg-paper" aria-labelledby="ingredients">
      <div className="h-14 bg-surface-2" aria-hidden />
      <div className="container-x section-y">
        <RevealGroup className="grid gap-5 md:grid-cols-6" stagger={110}>
          <RevealChild className="space-y-4 md:col-span-2 md:pr-6">
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 id="ingredients" className="h2">{data.title}</h2>
            <p className="text-[14px] leading-[1.75] text-body">{data.intro}</p>
          </RevealChild>
          <div className="md:col-span-2"><Card c={a} /></div>
          <div className="md:col-span-2"><Card c={b} /></div>
          {rest.map((c) => (
            <div key={c.name} className="md:col-span-2"><Card c={c} /></div>
          ))}
        </RevealGroup>
      </div>
      <div className="h-14 bg-surface-2" aria-hidden />
    </section>
  );
}
