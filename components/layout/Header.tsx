"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { nav } from "@/content/brand";
import { Logo } from "@/components/ui/Logo";
import { Bag, Close, Menu } from "@/components/ui/Icons";
import { useCart } from "@/components/commerce/CartProvider";
import { useLenis } from "@/components/motion/SmoothScroll";

const ease = [0.22, 1, 0.36, 1] as const;

export function Header({ account }: { account: React.ReactNode }) {
  const { count, setOpen, pulse, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  useEffect(() => {
    if (menu) lenis?.stop();
    else lenis?.start();
  }, [menu, lenis]);

  const onHome = pathname === "/";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-[400ms] ease-soft",
        scrolled ? "bg-surface-1/95 shadow-[0_6px_24px_rgba(11,66,80,0.08)] backdrop-blur" : onHome ? "bg-transparent" : "bg-paper",
      ].join(" ")}
    >
      <div className="container-x flex h-[76px] items-center justify-between md:h-[88px]">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-[14px] font-medium text-ink transition-opacity duration-[280ms] hover:opacity-70">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:gap-5">
          <div className="hidden md:block">{account}</div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative grid h-11 w-11 place-items-center text-ink"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <Bag />
            {ready && count > 0 ? (
              <motion.span
                key={pulse}
                initial={reduce ? false : { scale: 1 }}
                animate={reduce ? undefined : { scale: [1, 1.25, 1] }}
                transition={{ duration: 0.3, ease }}
                className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-paper"
              >
                {count}
              </motion.span>
            ) : null}
          </button>
          <button type="button" className="grid h-11 w-11 place-items-center text-ink md:hidden" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}>
            <Menu />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu ? (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-surface-1 md:hidden"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="container-x flex h-[76px] items-center justify-between">
              <Logo />
              <button type="button" className="grid h-11 w-11 place-items-center text-ink" onClick={() => setMenu(false)} aria-label="Close menu" autoFocus>
                <Close />
              </button>
            </div>
            <motion.nav
              aria-label="Mobile"
              className="container-x mt-8 flex flex-col gap-6"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.06, delayChildren: 0.1 } } }}
            >
              {nav.map((item) => (
                <motion.div key={item.href} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
                  <Link href={item.href} className="text-[32px] text-ink">{item.label}</Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="flex items-center justify-between gap-4 pt-4">
                {account}
                <Link href="/app" className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-paper">
                  Get the app
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
