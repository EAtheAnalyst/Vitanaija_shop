"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product, Tint } from "@/content/types";

export type CartLine = { slug: string; name: string; subtitle: string; price: number; tint: Tint; count: number; qty: number };

type ServerCart = { items: { slug: string; qty: number; product: Product }[] };

const toLine = (p: Product, qty: number): CartLine => ({ slug: p.slug, name: p.name, subtitle: p.subtitle, price: p.price, tint: p.tint, count: p.count, qty });

/** Local + server merge: the larger quantity wins, so syncing twice never doubles a line. */
function mergeCarts(local: CartLine[], server: ServerCart): CartLine[] {
  const out = new Map<string, CartLine>();
  for (const i of server.items) out.set(i.slug, toLine(i.product, i.qty));
  for (const l of local) {
    const s = out.get(l.slug);
    out.set(l.slug, s ? { ...s, qty: Math.max(s.qty, l.qty) } : l);
  }
  return [...out.values()];
}

const putCart = (lines: CartLine[]) =>
  fetch("/api/v1/cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: lines.map((l) => ({ slug: l.slug, qty: l.qty })) }),
  });

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

/** @param syncEmail the signed-in customer's email; when set, the cart syncs with /api/v1/cart (shared with the app). */
export function CartProvider({ children, syncEmail = null }: { children: React.ReactNode; syncEmail?: string | null }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const synced = useRef(false);

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

  // Signed in: pull the server cart once, merge it with this device's cart, and push the result.
  useEffect(() => {
    if (!ready || !syncEmail || synced.current) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/cart", { cache: "no-store" });
        if (!res.ok || cancelled) return;
        const server = (await res.json()) as ServerCart;
        setLines((local) => {
          const merged = mergeCarts(local, server);
          void putCart(merged);
          return merged;
        });
        synced.current = true;
      } catch {
        /* offline: keep the local cart, try again on the next page load */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, syncEmail]);

  // After the first sync, push every change (debounced) so the app sees it.
  useEffect(() => {
    if (!ready || !syncEmail || !synced.current) return;
    const t = setTimeout(() => void putCart(lines).catch(() => undefined), 600);
    return () => clearTimeout(t);
  }, [lines, ready, syncEmail]);

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
