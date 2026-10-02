"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product, Tint } from "@/content/types";

export type CartLine = { slug: string; name: string; subtitle: string; price: number; tint: Tint; count: number; qty: number };

type CartState = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  open: boolean;
  pulse: number;
  setOpen: (v: boolean) => void;
  add: (p: Product, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "vn-cart-v1";
export const MAX_QTY = 20;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* storage unavailable: start empty */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const add = useCallback((p: Product, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === p.slug);
      if (existing) return prev.map((l) => (l.slug === p.slug ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      return [...prev, { slug: p.slug, name: p.name, subtitle: p.subtitle, price: p.price, tint: p.tint, count: p.count, qty }];
    });
    setPulse((n) => n + 1);
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))));
  }, []);

  const remove = useCallback((slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
      ready,
      open,
      pulse,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, ready, open, pulse, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
