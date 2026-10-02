import type { Home } from "@/content/types";
import { HeroScene } from "@/components/art/HeroScene";
import { ButtonLink } from "@/components/ui/Button";

function Underlined({ line, word }: { line: string; word: string }) {
  const i = line.indexOf(word);
  if (i < 0) return <>{line}</>;
  return (
    <>
      {line.slice(0, i)}
      <span className="relative inline-block">
        {word}
        <svg viewBox="0 0 200 16" preserveAspectRatio="none" className="absolute -bottom-3 left-[-4%] h-3 w-[108%] text-accent" aria-hidden>
          <path d="M3 10 C50 3 120 2 197 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M30 14 C80 9 130 9 170 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        </svg>
      </span>
      {line.slice(i + word.length)}
    </>
  );
}

export function Hero({ data }: { data: Home["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-surface-1 pt-[76px] md:pt-[88px]">
      <div className="container-x grid items-center gap-6 pb-0 pt-10 md:grid-cols-[0.9fr_1.1fr] md:pt-6">
        <div className="hero-in relative z-10 space-y-7 pb-4 md:pb-24">
          <h1 className="h1">
            {data.headline[0]}
            <br />
            <Underlined line={data.headline[1]} word={data.underline} />
          </h1>
          <p className="max-w-[340px] text-[15px] font-medium leading-relaxed text-ink">{data.sub}</p>
          <div>
            <ButtonLink href={data.cta.href}>{data.cta.label}</ButtonLink>
          </div>
        </div>
        <div className="hero-art relative -mx-5 md:mx-0 md:-mr-24">
          <HeroScene className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}

export function MissionStrip({ text }: { text: string }) {
  return (
    <div className="bg-ink py-3.5">
      <p className="container-x text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-paper md:text-[12px]">{text}</p>
    </div>
  );
}
