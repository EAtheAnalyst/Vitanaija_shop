"use client";

import { useEffect, useRef } from "react";

// Scroll reveals (agent.md §6.2) built on CSS + IntersectionObserver.
// The hidden state only applies once <html> has the `js` class (set by an inline
// script, and skipped for reduced motion), so content is visible without JavaScript.

type Tag = "div" | "li" | "ul" | "section" | "article";
type Props = { children: React.ReactNode; className?: string; delay?: number; as?: Tag; distance?: number };

function useInView<T extends HTMLElement>(onEnter: (el: T) => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            onEnter(el);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

/** Fades and rises into place once. */
export function Reveal({ children, className, delay = 0, as = "div", distance }: Props) {
  const ref = useInView<HTMLElement>((el) => el.classList.add("is-in"));
  const Tag = as as "div";
  const style = { "--d": `${delay}ms`, ...(distance !== undefined ? { "--rd": `${distance}px` } : {}) } as React.CSSProperties;
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} data-reveal="" className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Direct children marked data-reveal (use <RevealChild>) appear one after another. */
export function RevealGroup({ children, className, as = "div", stagger = 140, delay = 0 }: Props & { stagger?: number }) {
  const ref = useInView<HTMLElement>((el) => {
    el.querySelectorAll<HTMLElement>(":scope [data-reveal-child]").forEach((child, i) => {
      child.style.setProperty("--d", `${delay + i * stagger}ms`);
      child.classList.add("is-in");
    });
  });
  const Tag = as as "div";
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}

export function RevealChild({ children, className, as = "div" }: Omit<Props, "delay">) {
  const Tag = as as "div";
  return (
    <Tag data-reveal-child="" className={className}>
      {children}
    </Tag>
  );
}
