import type { Tint } from "@/content/types";
import { tintVar } from "./Bottle";

/**
 * Placeholder for a lifestyle photo (agent.md §12: never fake real customers).
 * Swap for <Image> once real photography exists. The TODO badge shows in development only.
 */
export function PhotoSlot({
  label,
  tint = "mint",
  className = "",
  motif = "sun",
}: {
  label: string;
  tint?: Tint;
  className?: string;
  motif?: "sun" | "wave" | "leaf";
}) {
  return (
    <div role="img" aria-label={label} className={`relative overflow-hidden ${className}`} style={{ background: tintVar[tint] }}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        {motif === "sun" ? (
          <>
            <circle cx="140" cy="60" r="34" fill="#ffffff" opacity="0.55" />
            <path d="M0 150 Q60 110 120 140 T200 130 V200 H0Z" fill="#ffffff" opacity="0.35" />
            <path d="M0 175 Q70 140 140 168 T200 160 V200 H0Z" fill="#0b4250" opacity="0.08" />
          </>
        ) : motif === "wave" ? (
          <>
            <path d="M0 120 Q50 90 100 120 T200 120 V200 H0Z" fill="#ffffff" opacity="0.45" />
            <path d="M0 150 Q50 120 100 150 T200 150 V200 H0Z" fill="#ffffff" opacity="0.35" />
            <circle cx="60" cy="56" r="20" fill="#ffffff" opacity="0.5" />
          </>
        ) : (
          <>
            <path d="M40 160 C40 90 90 40 170 36 C166 116 116 166 40 160Z" fill="#ffffff" opacity="0.45" />
            <path d="M40 160 C80 120 110 96 150 70" stroke="#0b4250" strokeOpacity="0.12" strokeWidth="3" fill="none" />
          </>
        )}
      </svg>
      {process.env.NODE_ENV === "development" ? (
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-ink">
          TODO: photo
        </span>
      ) : null}
    </div>
  );
}
