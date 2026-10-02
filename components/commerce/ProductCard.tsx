import Link from "next/link";
import type { Product } from "@/content/types";
import { Bottle } from "@/components/art/Bottle";
import { formatNaira } from "@/lib/format";
import { AddToCart } from "./AddToCart";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden bg-surface-1" aria-label={product.name}>
        <div className="relative grid aspect-[4/5] place-items-center transition-transform duration-[500ms] ease-soft group-hover:scale-[1.03]">
          <Bottle id={`card-${product.slug}`} name={product.name} subtitle={product.subtitle} tint={product.tint} count={product.count} className="h-[58%] drop-shadow-[0_18px_18px_rgba(11,66,80,0.12)]" />
          {!product.inStock ? (
            <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-ink">Sold out</span>
          ) : null}
        </div>
      </Link>
      <h3 className="mt-5 text-[22px] text-ink">
        <Link href={`/products/${product.slug}`}>{product.name}</Link>
      </h3>
      <div className="mt-3 flex items-center justify-between">
        <AddToCart product={product} />
        <span className="text-[17px] text-ink">{formatNaira(product.price)}</span>
      </div>
    </article>
  );
}
