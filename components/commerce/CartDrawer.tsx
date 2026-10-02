"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { FREE_DELIVERY_FROM } from "@/content/delivery";
import { Bottle } from "@/components/art/Bottle";
import { Close, Minus, Plus } from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { useLenis } from "@/components/motion/SmoothScroll";
import { formatNaira } from "@/lib/format";
import { MAX_QTY, useCart } from "./CartProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function QtyStepper({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex h-9 items-center rounded-full border border-ink/15" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className="grid h-9 w-9 place-items-center text-ink" onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <Minus />
      </button>
      <span className="w-6 text-center text-[14px] text-ink" aria-live="polite">{value}</span>
      <button type="button" className="grid h-9 w-9 place-items-center text-ink disabled:opacity-40" onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        <Plus />
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove } = useCart();
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, setOpen]);

  const toFree = FREE_DELIVERY_FROM - subtotal;

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-ink/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            data-lenis-prevent
            className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-paper outline-none"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="text-[22px] text-ink">Your cart</h2>
              <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center text-ink" aria-label="Close cart">
                <Close />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <div className="leaf grid h-20 w-20 place-items-center bg-surface-1 text-accent">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15" /><path d="M5 19c3-4 6-7 10-9" /></svg>
                </div>
                <p className="text-[18px] text-ink">Your cart is empty.</p>
                <p className="text-[14px] text-body">Start with one of our best sellers.</p>
                <ButtonLink href="/shop">Shop best sellers</ButtonLink>
              </div>
            ) : (
              <>
                <div className="px-6 pt-4 text-[13px] text-body">
                  {toFree > 0 ? (
                    <p>Add <strong className="text-ink">{formatNaira(toFree)}</strong> more for free delivery.</p>
                  ) : (
                    <p className="text-accent">You've unlocked free delivery.</p>
                  )}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full origin-left rounded-full bg-accent-soft transition-transform duration-[500ms] ease-soft" style={{ transform: `scaleX(${Math.min(1, subtotal / FREE_DELIVERY_FROM)})` }} />
                  </div>
                </div>
                <ul className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
                  {lines.map((l) => (
                    <li key={l.slug} className="flex gap-4">
                      <Link href={`/products/${l.slug}`} onClick={() => setOpen(false)} className="grid h-24 w-20 shrink-0 place-items-center bg-surface-1">
                        <Bottle id={`d-${l.slug}`} name={l.name} subtitle={l.subtitle} tint={l.tint} count={l.count} className="h-[72%]" />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[16px] text-ink">{l.name}</p>
                            <p className="text-[12px] text-muted">{l.subtitle}</p>
                          </div>
                          <p className="text-[15px] text-ink">{formatNaira(l.price * l.qty)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <QtyStepper value={l.qty} onChange={(n) => setQty(l.slug, n)} label={l.name} />
                          <button type="button" onClick={() => remove(l.slug)} className="link-underline text-[12px] text-muted">Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-ink/10 px-6 py-6">
                  <div className="flex justify-between text-[16px] text-ink">
                    <span>Subtotal</span>
                    <span>{formatNaira(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-muted">Delivery is calculated at checkout. Pay when your order arrives.</p>
                  <ButtonLink href="/checkout" className="mt-5 w-full">Checkout</ButtonLink>
                </div>
              </>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
