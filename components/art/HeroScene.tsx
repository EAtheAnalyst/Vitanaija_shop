import { BottleShape } from "./Bottle";

/** Product still life on mint plinths, drawn in SVG (agent.md §12). */
export function HeroScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 520" className={className} role="img" aria-label="VitaNaija supplements arranged on mint display plinths">
      {/* floor */}
      <rect x="-200" y="404" width="1040" height="200" fill="#d6f1e6" />
      <ellipse cx="330" cy="430" rx="300" ry="26" fill="#bfe3d4" opacity="0.5" />

      {/* tall hexagonal block (back right) */}
      <polygon points="330,170 450,170 505,250 505,420 450,430 330,430" fill="#a4dac5" />
      <polygon points="450,170 505,250 505,420 450,430" fill="#8fcfb6" />
      <polygon points="330,170 450,170 478,150 358,150" fill="#c6eadc" />
      <polygon points="450,170 478,150 530,228 505,250" fill="#b5e3d1" />
      <polygon points="505,250 530,228 530,400 505,420" fill="#7fc5aa" />

      {/* cube (front left) */}
      <rect x="150" y="262" width="190" height="168" fill="#b3e1cf" />
      <polygon points="150,262 340,262 368,240 178,240" fill="#d3f0e4" />
      <polygon points="340,262 368,240 368,410 340,430" fill="#9ad5bf" />

      {/* cylinder (front right) */}
      <rect x="372" y="372" width="160" height="56" fill="#a9dcc8" />
      <ellipse cx="452" cy="428" rx="80" ry="16" fill="#a9dcc8" />
      <ellipse cx="452" cy="372" rx="80" ry="16" fill="#c9ecde" />

      {/* glass */}
      <g opacity="0.9">
        <path d="M70 318 L136 318 L132 436 Q103 446 74 436 Z" fill="#ffffff" fillOpacity="0.35" stroke="#ffffff" strokeOpacity="0.8" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={78 + i * 5.8} x2={79 + i * 5.4} y1="324" y2="432" stroke="#ffffff" strokeOpacity="0.55" />
        ))}
        <ellipse cx="103" cy="318" rx="33" ry="6" fill="#ffffff" fillOpacity="0.5" />
      </g>

      {/* pills */}
      <rect x="168" y="448" width="18" height="9" rx="4.5" fill="#ffffff" transform="rotate(-12 177 452)" />
      <rect x="194" y="446" width="18" height="9" rx="4.5" fill="#ffffff" transform="rotate(18 203 450)" />

      {/* bottles */}
      <g transform="translate(184 134) scale(0.72)">
        <BottleShape id="h-multi" name="Multivitamin" subtitle="13 Essential Vitamins" tint="peach" />
      </g>
      <g transform="translate(262 102) rotate(24 60 100) scale(0.72)">
        <BottleShape id="h-nia" name="Niacinamide" subtitle="Collagen + Hyaluronic" tint="mint" />
      </g>
      <g transform="translate(360 20) scale(0.74)">
        <BottleShape id="h-mag" name="Magnesium" subtitle="Complex" tint="lavender" />
      </g>
      <g transform="translate(408 228) scale(0.76)">
        <BottleShape id="h-glu" name="Glucosamine" subtitle="MSM and Turmeric" tint="sky" count={90} />
      </g>
      <g transform="translate(540 300) rotate(22 60 100) scale(0.6)">
        <BottleShape id="h-pro" name="Probiotic" subtitle="Complex" tint="blush" count={30} />
      </g>
    </svg>
  );
}
