import type { Ingredient } from "@/content/types";

/** Decorative ingredient textures that bleed off a card's bottom-right corner. */
export function Texture({ kind }: { kind: Ingredient["texture"] }) {
  const common = "pointer-events-none absolute -bottom-2 -right-2 h-36 w-36";
  switch (kind) {
    case "droplet":
      return (
        <svg viewBox="0 0 140 140" className={common} aria-hidden>
          <circle cx="98" cy="22" r="16" fill="#f2c64e" opacity="0.85" />
          <circle cx="98" cy="22" r="11" fill="#f8dc84" />
          <path d="M140 140 L70 140 Q66 108 92 98 Q104 70 128 76 Q140 80 140 96Z" fill="#efbe3a" />
          <circle cx="78" cy="78" r="9" fill="#f2c64e" />
          <circle cx="62" cy="100" r="6" fill="#f5d06a" />
        </svg>
      );
    case "bubbles":
      return (
        <svg viewBox="0 0 140 140" className={common} aria-hidden>
          <circle cx="40" cy="22" r="11" fill="#ffffff" />
          <circle cx="78" cy="36" r="8" fill="#ffffff" />
          <circle cx="34" cy="70" r="13" fill="#ffffff" />
          <path d="M140 140 L70 140 Q62 80 112 74 Q140 72 140 90Z" fill="#ffffff" />
        </svg>
      );
    case "powder":
      return (
        <svg viewBox="0 0 140 140" className={common} aria-hidden>
          {Array.from({ length: 70 }, (_, i) => {
            const a = (i * 137.5 * Math.PI) / 180;
            const r = 6 + (i % 23) * 3.2;
            return <circle key={i} cx={118 - Math.abs(Math.cos(a) * r)} cy={118 - Math.abs(Math.sin(a) * r * 1.4)} r={1 + (i % 3)} fill="#ef9a72" opacity={0.35 + (i % 5) * 0.12} />;
          })}
          <path d="M140 140 L96 140 Q100 108 140 96Z" fill="#ee9670" />
        </svg>
      );
    case "cream":
      return (
        <svg viewBox="0 0 140 140" className={common} aria-hidden>
          <circle cx="104" cy="104" r="58" fill="#fbf3e2" />
          <circle cx="104" cy="104" r="58" fill="none" stroke="#efe2c4" />
          <circle cx="86" cy="86" r="10" fill="#fffaf0" />
        </svg>
      );
    case "granules":
      return (
        <svg viewBox="0 0 140 140" className={common} aria-hidden>
          {Array.from({ length: 90 }, (_, i) => {
            const x = 60 + ((i * 37) % 80);
            const y = 60 + ((i * 53) % 80);
            return <circle key={i} cx={x} cy={y} r={1.2 + (i % 3) * 0.8} fill="#ffffff" opacity={0.6 + (i % 4) * 0.1} />;
          })}
        </svg>
      );
  }
}
