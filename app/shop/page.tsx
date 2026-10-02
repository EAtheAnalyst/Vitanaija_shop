import type { Metadata } from "next";
import Link from "next/link";
import { goals } from "@/content/products";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Reveal, RevealChild, RevealGroup } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "Shop", description: "Everyday supplements for energy, immunity, joints, gut health, skin and sleep." };

type Search = Promise<{ goal?: string; sort?: string }>;

export default async function ShopPage({ searchParams }: { searchParams: Search }) {
  const { goal, sort } = await searchParams;
  let list = await getProducts();
  if (goal) list = list.filter((p) => p.goal === goal);
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

  const href = (g?: string, s?: string) => {
    const q = new URLSearchParams();
    if (g) q.set("goal", g);
    if (s) q.set("sort", s);
    const str = q.toString();
    return str ? `/shop?${str}` : "/shop";
  };
  const chip = (active: boolean) =>
    `inline-flex h-10 items-center rounded-full px-5 text-[13px] font-medium transition-colors duration-[280ms] ${active ? "bg-ink text-paper" : "bg-surface-2 text-ink hover:bg-surface-1"}`;

  return (
    <>
      <section className="bg-surface-1 pb-16 pt-[140px] md:pt-[160px]">
        <Reveal className="container-x">
          <p className="eyebrow">Shop</p>
          <h1 className="h1 mt-3">Find your daily<br />better</h1>
          <p className="mt-5 max-w-[440px] text-[15px] leading-[1.75] text-body">Every order is pay on delivery, with delivery to all 36 states and the FCT.</p>
        </Reveal>
      </section>
      <section className="container-x py-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Filter by health goal" className="flex flex-wrap gap-2">
            <Link href={href(undefined, sort)} className={chip(!goal)} aria-current={!goal ? "page" : undefined}>All</Link>
            {goals.map((g) => (
              <Link key={g.id} href={href(g.id, sort)} className={chip(goal === g.id)} aria-current={goal === g.id ? "page" : undefined}>{g.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-[13px] text-body">
            <span>Sort:</span>
            <Link href={href(goal)} className={chip(!sort)}>Popular</Link>
            <Link href={href(goal, "price-asc")} className={chip(sort === "price-asc")}>Price ↑</Link>
            <Link href={href(goal, "price-desc")} className={chip(sort === "price-desc")}>Price ↓</Link>
          </div>
        </div>
        {list.length ? (
          <RevealGroup key={`${goal}-${sort}`} className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" stagger={110}>
            {list.map((p) => (
              <RevealChild key={p.slug}><ProductCard product={p} /></RevealChild>
            ))}
          </RevealGroup>
        ) : (
          <p className="mt-16 text-center text-body">No products match this goal yet. <Link className="link-underline text-ink" href="/shop">See everything</Link></p>
        )}
      </section>
    </>
  );
}
