import Link from "next/link";
import { brand, footer } from "@/content/brand";
import { Logo } from "@/components/ui/Logo";
import { Social } from "@/components/ui/Icons";
import { EmailCapture } from "@/components/ui/EmailCapture";

export function Footer() {
  const socials = (Object.entries(brand.social) as ["instagram" | "facebook" | "x", string | undefined][]).filter(([, url]) => url);
  return (
    <footer className="bg-paper pb-10 pt-20">
      <div className="container-x grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
        <div className="space-y-5">
          <Logo />
          <p className="text-[14px] text-body">{brand.email.info}</p>
          <p className="text-[14px] text-body">{brand.email.press}</p>
          <div className="flex gap-3">
            {socials.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name} className="grid h-8 w-8 place-items-center rounded-full bg-surface-1 text-ink transition-colors duration-[280ms] hover:bg-accent-soft hover:text-paper">
                <Social name={name} />
              </a>
            ))}
          </div>
        </div>
        <FooterCol title="Take a Tour" links={footer.tour} />
        <FooterCol title="Our Company" links={footer.company} />
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Subscribe</h3>
          <p className="mb-4 mt-4 max-w-[220px] text-[14px] text-muted">Subscribe to get the latest news from us.</p>
          <EmailCapture source="footer" compact />
        </div>
      </div>
      <p className="container-x mt-14 text-center text-[13px] text-muted">
        Copyright © {brand.name} {new Date().getFullYear()}. All rights reserved.
      </p>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <ul className="mt-4 space-y-4">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[14px] text-muted transition-colors duration-[280ms] hover:text-ink">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
