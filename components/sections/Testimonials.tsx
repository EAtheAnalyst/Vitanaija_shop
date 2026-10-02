"use client";

import Link from "next/link";
import { useState } from "react";
import type { Home, Review } from "@/content/types";
import { ArrowLeft, ArrowRight, Star } from "@/components/ui/Icons";
import { Reveal, RevealChild, RevealGroup } from "@/components/motion/Reveal";

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="rounded-[8px] bg-paper p-7 shadow-[0_10px_30px_rgba(11,66,80,0.04)]">
      <div className="flex items-center gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-1 text-[15px] font-semibold text-ink" aria-hidden>
          {r.name.charAt(0)}
        </span>
        <div>
          <p className="text-[15px] font-medium text-ink">{r.name}</p>
          <div className="mt-1 flex gap-0.5 text-star" aria-label={`${r.rating} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => <Star key={i} filled={i < r.rating} className="h-3 w-3" />)}
          </div>
        </div>
        {r.sample ? <span className="ml-auto rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold uppercase text-ink">Sample</span> : null}
      </div>
      <p className="mt-4 text-[13px] leading-[1.75] text-body">{r.text}</p>
      {r.city ? <p className="mt-3 text-[12px] text-muted">{r.city}</p> : null}
    </article>
  );
}

export function Testimonials({ data, reviews }: { data: Home["testimonials"]; reviews: Review[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(reviews.length / 4));
  const shown = reviews.slice(page * 4, page * 4 + 4);
  const [r0, r1, r2, r3] = shown;

  return (
    <section id="reviews" className="scroll-mt-24 bg-surface-2" aria-labelledby="testimonials">
      <div className="container-x section-y">
        <Reveal className="text-center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="testimonials" className="h2 mt-3">{data.title[0]}<br />{data.title[1]}</h2>
        </Reveal>
        <div className="relative mt-16">
          <span className="leaf absolute -left-2 bottom-6 hidden h-14 w-16 bg-lavender md:block" aria-hidden />
          <span className="leaf absolute right-[30%] top-[-24px] hidden h-14 w-16 bg-surface-1 md:block" aria-hidden />
          <span className="absolute bottom-10 right-[33%] hidden h-16 w-16 rounded-[0_0_0_64px] bg-sky md:block" aria-hidden />
          <RevealGroup key={page} className="relative grid items-center gap-6 md:grid-cols-3" stagger={130}>
            {r0 ? <RevealChild><ReviewCard r={r0} /></RevealChild> : null}
            <div className="flex flex-col gap-6">
              {r1 ? <RevealChild><ReviewCard r={r1} /></RevealChild> : null}
              {r3 ? <RevealChild><ReviewCard r={r3} /></RevealChild> : null}
            </div>
            {r2 ? <RevealChild><ReviewCard r={r2} /></RevealChild> : null}
          </RevealGroup>
          {pages > 1 ? (
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPage((p) => (p - 1 + pages) % pages)} className="grid h-8 w-8 place-items-center rounded-full bg-surface-1 text-ink" aria-label="Previous reviews"><ArrowLeft /></button>
              <button type="button" onClick={() => setPage((p) => (p + 1) % pages)} className="grid h-8 w-8 place-items-center rounded-full bg-surface-1 text-ink" aria-label="Next reviews"><ArrowRight /></button>
            </div>
          ) : null}
        </div>
        <div className="mt-12 text-center">
          <Link href={data.viewAll.href} className="link-underline text-[12px] font-bold uppercase tracking-[0.08em] text-ink">{data.viewAll.label}</Link>
        </div>
      </div>
    </section>
  );
}
