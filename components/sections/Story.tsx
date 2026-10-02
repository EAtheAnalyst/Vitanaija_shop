import type { Home } from "@/content/types";
import { PhotoSlot } from "@/components/art/PhotoSlot";
import { ButtonLink } from "@/components/ui/Button";
import { BenefitIcon, ThumbUp } from "@/components/ui/Icons";
import { Reveal, RevealChild, RevealGroup } from "@/components/motion/Reveal";

export function About({ data }: { data: Home["about"] }) {
  return (
    <section className="bg-paper" aria-labelledby="about">
      <div className="rounded-tl-[120px] bg-surface-2 md:rounded-tl-[200px]">
        <div className="container-x section-y grid items-center gap-14 md:grid-cols-2">
          <RevealGroup className="grid grid-cols-[1.25fr_1fr] gap-5" stagger={160}>
            <RevealChild>
              <PhotoSlot label="Couple sharing breakfast at home" tint="sun" className="aspect-[3/4.4] rounded-[0_110px_0_110px]" />
            </RevealChild>
            <div className="flex flex-col gap-5">
              <RevealChild className="flex gap-4">
                <span className="h-14 w-14 rounded-full bg-surface-1" aria-hidden />
                <span className="leaf-sm h-14 w-16 bg-accent-soft" aria-hidden />
              </RevealChild>
              <RevealChild>
                <PhotoSlot label="Woman stretching after a morning run" tint="sky" motif="wave" className="aspect-square rounded-[0_80px_80px_0]" />
              </RevealChild>
              <RevealChild>
                <PhotoSlot label="Older couple laughing outdoors" tint="peach" className="aspect-square rounded-[0_80px_80px_0]" />
              </RevealChild>
            </div>
          </RevealGroup>
          <Reveal className="space-y-5" delay={150}>
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 id="about" className="h2">{data.title[0]}<br />{data.title[1]}</h2>
            {data.body.map((p) => (
              <p key={p} className="max-w-[440px] text-[15px] leading-[1.75] text-body">{p}</p>
            ))}
            <p className="text-[15px] font-semibold leading-[1.75] text-ink">{data.closer[0]}<br />{data.closer[1]}</p>
            <div className="pt-2"><ButtonLink href={data.cta.href}>{data.cta.label}</ButtonLink></div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Benefits({ data }: { data: Home["benefits"] }) {
  return (
    <section className="bg-surface-2" aria-labelledby="benefits">
      <div className="container-x section-y !pt-8">
        <Reveal className="space-y-3">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="benefits" className="h2">{data.title}</h2>
        </Reveal>
        <RevealGroup as="ul" className="mt-14 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" stagger={100}>
          {data.items.map((b) => (
            <RevealChild as="li" key={b.title}>
              <div className="leaf grid h-16 w-20 place-items-center bg-paper text-accent">
                <BenefitIcon name={b.icon} />
              </div>
              <h3 className="mt-6 text-[19px] font-medium text-ink">{b.title}</h3>
              <p className="mt-3 max-w-[260px] text-[14px] leading-relaxed text-body">{b.text}</p>
            </RevealChild>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export function Guarantee({ data }: { data: Home["guarantee"] }) {
  return (
    <section className="bg-surface-2" aria-labelledby="guarantee">
      <div className="container-x grid items-center gap-14 pb-24 md:grid-cols-2 md:pb-32">
        <Reveal className="space-y-6">
          <span className="leaf-sm grid h-9 w-9 place-items-center bg-accent text-paper"><ThumbUp /></span>
          <h2 id="guarantee" className="h2">{data.title[0]}<br />{data.title[1]}</h2>
          <p className="max-w-[340px] text-[14px] leading-[1.8] text-body">
            {data.body} <strong className="font-semibold text-ink">{data.bold}</strong>
          </p>
        </Reveal>
        <Reveal className="relative" distance={60} delay={120}>
          <span className="absolute -left-4 top-0 h-36 w-36 rounded-full bg-ink md:h-44 md:w-44" aria-hidden />
          <PhotoSlot label="Smiling couple" tint="mint" motif="leaf" className="relative ml-6 mt-14 aspect-[4/3.3] rounded-[160px_8px_160px_8px]" />
        </Reveal>
      </div>
    </section>
  );
}
