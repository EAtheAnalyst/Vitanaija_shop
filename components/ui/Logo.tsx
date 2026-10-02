import Link from "next/link";
import { brand } from "@/content/brand";

export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <path d="M2 12 Q2 2 12 2 L13 2 L13 10 Q13 13 10 13 L2 13Z" fill="var(--c-accent)" />
      <path d="M2 15 L10 15 Q13 15 13 18 L13 26 L12 26 Q2 26 2 16Z" fill="var(--c-accent)" opacity="0.85" />
      <path d="M15 2 L16 2 Q26 2 26 12 L26 13 L18 13 Q15 13 15 10Z" fill="var(--c-accent-soft)" />
      <path d="M15 18 Q15 15 18 15 L26 15 L26 16 Q26 26 16 26 L15 26Z" fill="var(--c-accent)" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`} aria-label={`${brand.name} home`}>
      <LogoMark />
      <span className="text-[24px] leading-none tracking-[0.02em] text-ink">
        <span className="font-semibold">{brand.wordmark[0]}</span>
        <span className="font-medium text-accent-soft">{brand.wordmark[1]}</span>
      </span>
    </Link>
  );
}
