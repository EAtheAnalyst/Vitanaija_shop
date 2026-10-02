"use client";

import { useState } from "react";
import type { Product } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "./CartProvider";
import { QtyStepper } from "./CartDrawer";

export function ProductBuy({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  if (!product.inStock) {
    return (
      <div className="rounded-[8px] bg-surface-2 p-5 text-[14px] text-body">
        <p className="font-semibold text-ink">Sold out</p>
        <p className="mt-1">This product is restocking. Join the newsletter at the bottom of the page to hear when it's back.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-4">
      <QtyStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} label={product.name} />
      <Button type="button" onClick={() => add(product, qty)} className="flex-1 sm:flex-none">Add to cart</Button>
    </div>
  );
}
