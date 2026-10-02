import type { Home } from "@/content/types";
import { BottleShape } from "@/components/art/Bottle";
import { EmailCapture } from "@/components/ui/EmailCapture";
import { Reveal } from "@/components/motion/Reveal";

export function Newsletter({ data }: { data: Home["newsletter"] }) {
  return (
    <section className="bg-[linear-gradient(var(--c-surface-2)_50%,var(--c-paper)_50%)]" aria-labelledby="newsletter">
      <div className="container-x pt-6">
        <Reveal className="relative grid overflow-visible rounded-[8px] bg-surface-1 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 p-8 md:p-16">
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 id="newsletter" className="h2 !text-[clamp(26px,2.6vw,32px)]">{data.title[0]}<br />{data.title[1]}</h2>
            <p className="max-w-[380px] text-[14px] leading-[1.75] text-body">{data.body}</p>
            <div className="pt-2"><EmailCapture source="home" /></div>
          </div>
          <div className="relative min-h-[260px] md:min-h-0">
            <div className="absolute inset-x-6 bottom-6 top-6 rounded-[0_160px_0_160px] bg-ink md:inset-x-0 md:-top-8 md:bottom-12 md:right-10" />
            <span className="leaf-sm absolute bottom-10 right-10 h-10 w-12 bg-accent-soft md:bottom-14 md:right-14" aria-hidden />
            <svg viewBox="0 0 260 260" className="absolute inset-0 m-auto h-[85%] w-[85%] md:-top-10" aria-hidden>
              <rect x="30" y="40" width="20" height="9" rx="4.5" fill="#fff" transform="rotate(30 40 44)" />
              <rect x="200" y="70" width="20" height="9" rx="4.5" fill="#fff" transform="rotate(-40 210 74)" />
              <rect x="50" y="180" width="20" height="9" rx="4.5" fill="#fff" transform="rotate(-20 60 184)" />
              <rect x="40" y="110" width="20" height="9" rx="4.5" fill="#fff" transform="rotate(70 50 114)" />
              <g className="float-slow" style={{ transformOrigin: "130px 130px", transformBox: "view-box" }}>
                <g transform="translate(80 40) scale(0.9)">
                  <BottleShape id="news" name="Magnesium" subtitle="Complex" tint="lavender" />
                </g>
              </g>
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
