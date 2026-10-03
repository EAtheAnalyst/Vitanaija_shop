import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { brand } from "@/content/brand";
import { env } from "@/lib/env";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CartProvider } from "@/components/commerce/CartProvider";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountLink } from "@/components/layout/AccountLink";
import { auth } from "@/auth";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: `${brand.name} · Everyday supplements, delivered across Nigeria`, template: `%s · ${brand.name}` },
  description: `${brand.tagline} Pay on delivery, delivery to all 36 states and the FCT.`,
  openGraph: { siteName: brand.name, locale: "en_NG", type: "website" },
};

export const viewport: Viewport = { themeColor: "#cdebe1" };

// Adds `js` to <html> before paint (skipped for reduced motion), which turns on the
// reveal styles. Without JS the content is simply visible.
const bootScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth().catch(() => null);
  return (
    <html lang="en-NG" className={dmSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper">
          Skip to content
        </a>
        <CartProvider syncEmail={session?.user?.email ?? null}>
          <SmoothScroll>
            <Header account={<AccountLink />} />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
