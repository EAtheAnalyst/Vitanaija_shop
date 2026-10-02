import Link from "next/link";
import { ArrowRight } from "./Icons";

type Common = { children: React.ReactNode; className?: string; variant?: "ink" | "light"; arrow?: boolean };

const styles = (variant: Common["variant"], className = "") =>
  [
    "group inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-[12px] font-bold uppercase tracking-[0.08em]",
    "transition-[background-color,color,opacity] duration-[280ms] ease-soft disabled:cursor-not-allowed disabled:opacity-50",
    variant === "light" ? "bg-paper text-ink hover:bg-surface-2" : "bg-ink text-paper hover:bg-[#145566]",
    className,
  ].join(" ");

const Arrow = () => (
  <span className="transition-transform duration-[280ms] ease-soft group-hover:translate-x-1">
    <ArrowRight />
  </span>
);

export function ButtonLink({ href, children, className, variant = "ink", arrow = true }: Common & { href: string }) {
  return (
    <Link href={href} className={styles(variant, className)}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

export function Button({
  children,
  className,
  variant = "ink",
  arrow = true,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={styles(variant, className)} {...rest}>
      {children}
      {arrow ? <Arrow /> : null}
    </button>
  );
}
