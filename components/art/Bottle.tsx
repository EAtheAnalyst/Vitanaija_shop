import type { Tint } from "@/content/types";
import { brand } from "@/content/brand";

export const tintVar: Record<Tint, string> = {
  lavender: "var(--tint-lavender)",
  peach: "var(--tint-peach)",
  sky: "var(--tint-sky)",
  blush: "var(--tint-blush)",
  mint: "var(--tint-mint)",
  sun: "var(--tint-sun)",
};

// Darker label ink per tint, for the logo mark on the label.
const markInk: Record<Tint, string> = {
  lavender: "#7a5bb5",
  peach: "#d4583a",
  sky: "#3f6fb0",
  blush: "#c2456a",
  mint: "#2f8a5f",
  sun: "#b98510",
};

type Props = { name: string; subtitle?: string; tint: Tint; count?: number; id: string };

/** A supplement bottle drawn in a 120×200 box, as an SVG group (for use inside scenes). */
export function BottleShape({ name, subtitle, tint, count = 60, id }: Props) {
  const ridges = Array.from({ length: 13 }, (_, i) => 33 + i * 4.5);
  return (
    <g>
      <defs>
        <linearGradient id={`body-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#e9eeec" />
          <stop offset="0.25" stopColor="#ffffff" />
          <stop offset="0.8" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfe6e3" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <rect x="12" y="44" width="96" height="152" rx="24" />
        </clipPath>
      </defs>
      {/* cap */}
      <rect x="28" y="2" width="64" height="40" rx="7" fill={`url(#body-${id})`} />
      {ridges.map((x) => (
        <line key={x} x1={x} x2={x} y1="7" y2="38" stroke="#d6dedb" strokeWidth="1.4" />
      ))}
      <rect x="24" y="38" width="72" height="10" rx="4" fill="#f4f7f6" />
      {/* body */}
      <rect x="12" y="44" width="96" height="152" rx="24" fill={`url(#body-${id})`} />
      <g clipPath={`url(#clip-${id})`}>
        <rect x="12" y="76" width="96" height="78" fill={tintVar[tint]} />
        <rect x="12" y="154" width="96" height="2" fill="#ffffff" opacity="0.6" />
      </g>
      {/* label */}
      <g transform="translate(22 86)">
        <path d="M0 6 Q0 0 6 0 L10 0 L10 4 Q10 10 4 10 L0 10Z" fill={markInk[tint]} />
        <path d="M12 0 L16 0 Q22 0 22 6 L22 10 L18 10 Q12 10 12 4Z" fill={markInk[tint]} opacity="0.8" />
        <text x="0" y="24" fontSize="4.6" fill="#2d5560" fontFamily="inherit">◎ Made in Nigeria</text>
        <text x="0" y="37" fontSize="10" fontWeight="600" fill="#0b4250" fontFamily="inherit">{name}</text>
        {subtitle ? (
          <text x="0" y="46" fontSize="4.6" fill="#2d5560" fontFamily="inherit">
            {subtitle.length > 30 ? subtitle.slice(0, 29) + "…" : subtitle}
          </text>
        ) : null}
        <text x="64" y="62" fontSize="8" fill={markInk[tint]} textAnchor="end" fontFamily="inherit">{count}</text>
      </g>
      <text
        x="0"
        y="0"
        fontSize="8.5"
        fontWeight="600"
        fill="#ffffff"
        fontFamily="inherit"
        transform="translate(99 88) rotate(90)"
        letterSpacing="0.5"
      >
        {brand.wordmark.join("")}
      </text>
      <rect x="22" y="162" width="76" height="2" rx="1" fill="#e3e9e7" />
      <rect x="22" y="168" width="54" height="2" rx="1" fill="#e3e9e7" />
    </g>
  );
}

export function Bottle({ className, ...props }: Props & { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" className={className} role="img" aria-label={`${props.name} bottle`}>
      <BottleShape {...props} />
    </svg>
  );
}
