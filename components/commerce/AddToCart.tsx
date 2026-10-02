"use client";

import type { Product } from "@/content/types";
import { ArrowRight } from "@/components/ui/Icons";
import { useCart } from "./CartProvider";

/**
 * Mint circle + label. On hover/focus the circle grows into a pill behind the label
 * (clip-path, not width, so it stays on the compositor — agent.md §5).
 */
export function AddToCart({ product, qty = 1, className = "" }: { product: Product; qty?: number; className?: string }) {
  const { add } = useCart();
  if (!product.inStock) {
    return (
      <span className={`inline-flex h-9 items-center rounded-full bg-surface-2 px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-muted ${className}`}>
        Sold out
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => add(product, qty)}
      className={`group/atc relative inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap pr-4 text-[11px] font-bold uppercase tracking-[0.08em] text-ink ${className}`}
      aria-label={`Add ${product.name} to cart`}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-surface-1 transition-[clip-path] duration-[300ms] ease-soft [clip-path:inset(0_calc(100%-36px)_0_0_round_999px)] group-hover/atc:[clip-path:inset(0_0_0_0_round_999px)] group-focus-visible/atc:[clip-path:inset(0_0_0_0_round_999px)]"
      />
      <span className="relative grid h-9 w-9 place-items-center">
        <ArrowRight />
      </span>
      <span className="relative">Add to cart</span>
    </button>
  );
}
