"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "./Icons";

/**
 * Scroll-snap carousel: 3 cards on desktop, 2 on tablet, 1.15 on mobile so the next card peeks.
 * Arrows scroll by one card with the browser's smooth scroll. No auto-play (agent.md §8).
 */
export function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const items = Children.toArray(children);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 32 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrow = "grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-ink transition-[opacity,background-color] duration-[280ms] hover:bg-surface-1 disabled:opacity-30";

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <button type="button" onClick={() => go(-1)} disabled={atStart} aria-label="Previous products" className={`${arrow} absolute -left-12 top-[38%] z-10 hidden lg:grid`}>
        <ArrowLeft />
      </button>
      <ul
        ref={track}
        className="-mx-5 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <li key={i} className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)]" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
            {child}
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => go(1)} disabled={atEnd} aria-label="Next products" className={`${arrow} absolute -right-12 top-[38%] z-10 hidden lg:grid`}>
        <ArrowRight />
      </button>
    </div>
  );
}
