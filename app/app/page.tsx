import type { Metadata } from "next";
import Image from "next/image";
import QRCode from "qrcode";
import { androidApp } from "@/content/app";
import { brand } from "@/content/brand";
import { BenefitIcon } from "@/components/ui/Icons";
import { Reveal, RevealChild, RevealGroup } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Get the Android app",
  description: `Download the ${brand.name} app for Android: shop, pay on delivery and track your orders.`,
};

const steps = [
  { title: "Download", text: "Tap the button to download the VitaNaija APK file." },
  { title: "Allow the install", text: "Android asks once. Tap Settings, turn on “Allow from this source”, then go back." },
  { title: "Install and open", text: "Tap Install, then Open. Sign in with Google to keep the same cart as the website." },
];

const perks: { icon: "cash" | "truck" | "shield"; text: string }[] = [
  { icon: "cash", text: "Same products and prices as the website" },
  { icon: "truck", text: "Your cart follows you between phone and web" },
  { icon: "shield", text: "Track every order, placed in the app or online" },
];

export default async function AppPage() {
  // QR code for desktop visitors: scan with a phone to download directly.
  const qr = await QRCode.toString(androidApp.apkUrl, { type: "svg", margin: 0, color: { dark: "#0b4250", light: "#ffffff" } });

  return (
    <>
      <section className="rounded-br-[120px] bg-surface-1 pb-20 pt-[130px] md:rounded-br-[200px] md:pt-[160px]">
        <div className="container-x grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="space-y-6">
            <p className="eyebrow">Android app</p>
            <h1 className="h1">{brand.name},<br />in your pocket</h1>
            <p className="max-w-[440px] text-[15px] leading-[1.75] text-body">
              Shop everyday supplements, pay on delivery and track your orders from your phone. Sign in once and your cart stays in sync with the website.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={androidApp.apkUrl}
                download
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-ink px-8 text-[13px] font-bold uppercase tracking-[0.08em] text-paper transition-colors duration-[280ms] hover:bg-[#145566]"
              >
                <AndroidIcon />
                Download for Android
              </a>
              <span className="text-[13px] text-muted">
                v{androidApp.version} · APK · {androidApp.approxSize} · {androidApp.minAndroid}
              </span>
            </div>
            <p className="text-[13px] text-muted">
              Coming to Google Play soon. On iPhone? Use the website. It works just like the app.
            </p>
          </Reveal>

          <Reveal delay={150} className="flex flex-col items-center gap-6">
            <Image src="/app-icon.png" alt={`${brand.name} app icon`} width={160} height={160} className="drop-shadow-[0_24px_30px_rgba(11,66,80,0.15)]" priority />
            <div className="hidden flex-col items-center gap-3 rounded-[24px] bg-paper p-6 md:flex">
              <div className="h-40 w-40" aria-label="QR code to download the Android app" role="img" dangerouslySetInnerHTML={{ __html: qr }} />
              <p className="text-[12px] text-muted">Scan with your Android phone</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x section-y">
        <Reveal><h2 className="h2">Install in three steps</h2></Reveal>
        <RevealGroup as="ol" className="mt-12 grid gap-10 md:grid-cols-3" stagger={120}>
          {steps.map((s, i) => (
            <RevealChild as="li" key={s.title}>
              <span className="leaf grid h-14 w-16 place-items-center bg-surface-1 text-[20px] text-ink">{i + 1}</span>
              <h3 className="mt-5 text-[19px] font-medium text-ink">{s.title}</h3>
              <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-body">{s.text}</p>
            </RevealChild>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-surface-2">
        <div className="container-x section-y grid gap-10 md:grid-cols-2">
          <Reveal className="space-y-4">
            <p className="eyebrow">Why the app</p>
            <h2 className="h2">Everything from the website, one tap away</h2>
          </Reveal>
          <RevealGroup as="ul" className="space-y-5" stagger={100}>
            {perks.map((p) => (
              <RevealChild as="li" key={p.text} className="flex items-center gap-4 text-[15px] text-ink">
                <span className="leaf-sm grid h-11 w-12 place-items-center bg-paper text-accent"><BenefitIcon name={p.icon} className="h-5 w-5" /></span>
                {p.text}
              </RevealChild>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="container-x max-w-[760px] py-20 text-[14px] leading-[1.8] text-body">
        <h2 className="text-[20px] text-ink">Is it safe to install an APK?</h2>
        <p className="mt-3">
          Yes, when it comes from us. This file is published by {brand.name} on our official release page. Android asks for
          permission because the app isn&apos;t from the Play Store yet. Only install VitaNaija from this page or from{" "}
          <a href={androidApp.releasesUrl} className="underline underline-offset-4" target="_blank" rel="noreferrer">our GitHub releases</a>.
        </p>
      </section>
    </>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 00-.66-.38l-1.87 3.23a11.43 11.43 0 00-9.82 0L5.22 5.92a.38.38 0 00-.66.38L6.4 9.48A10.78 10.78 0 001 18h22a10.78 10.78 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 111.25-1.25A1.25 1.25 0 017 15.25zm10 0A1.25 1.25 0 1118.25 14 1.25 1.25 0 0117 15.25z" />
    </svg>
  );
}
