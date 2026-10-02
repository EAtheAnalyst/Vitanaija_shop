import { Reveal } from "@/components/motion/Reveal";

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="rounded-br-[120px] bg-surface-1 pb-16 pt-[140px] md:rounded-br-[200px] md:pt-[170px]">
      <Reveal className="container-x">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h1 mt-3 max-w-[720px]">{title}</h1>
        {intro ? <p className="mt-5 max-w-[520px] text-[15px] leading-[1.75] text-body">{intro}</p> : null}
      </Reveal>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="container-x max-w-[760px] py-20 text-[15px] leading-[1.8] text-body [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-[24px] [&_h2]:text-ink [&_li]:mt-2 [&_p]:mt-4 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5">
      {children}
    </Reveal>
  );
}
