type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const ArrowRight = ({ className = "h-3.5 w-3.5" }: P) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden {...base}><path d="M2 8h12M9 3l5 5-5 5" /></svg>
);
export const ArrowLeft = ({ className = "h-3.5 w-3.5" }: P) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden {...base}><path d="M14 8H2M7 3L2 8l5 5" /></svg>
);
export const Bag = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
);
export const Menu = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M4 8h16M4 16h16" /></svg>
);
export const Close = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Plus = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden {...base}><path d="M8 3v10M3 8h10" /></svg>
);
export const Minus = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden {...base}><path d="M3 8h10" /></svg>
);
export const Check = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden {...base}><path d="M3 8.5l3 3 7-7" /></svg>
);
export const ThumbUp = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden fill="currentColor"><path d="M2 7h2.5v7H2zM6 14V7l3-5c1 0 1.7.8 1.5 1.8L10 6h3.2c.9 0 1.5.8 1.3 1.6l-1.2 5A1.8 1.8 0 0111.6 14z" /></svg>
);
export const Star = ({ className = "h-3.5 w-3.5", filled = true }: P & { filled?: boolean }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1">
    <path d="M8 1.5l1.9 4 4.4.5-3.3 3 .9 4.3L8 11.1l-3.9 2.2.9-4.3-3.3-3 4.4-.5z" />
  </svg>
);

export const BenefitIcon = ({ name, className = "h-6 w-6" }: P & { name: "flask" | "leaf" | "shield" | "truck" | "cash" | "map" }) => {
  const s = { ...base, strokeWidth: 1.5 };
  switch (name) {
    case "flask":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden {...s}><path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 001.3 2h11.4A1.5 1.5 0 0019 19l-5-10V3" /><path d="M9 15l2 2 4-4" /></svg>;
    case "leaf":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden {...s}><path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15" /><path d="M5 19c3-4 6-7 10-9" /></svg>;
    case "shield":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden {...s}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>;
    case "truck":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden {...s}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>;
    case "cash":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden {...s}><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v.01M18 15v.01" /></svg>;
    case "map":
      return <svg viewBox="0 0 24 24" className={className} aria-hidden {...s}><path d="M12 21s-6-5.6-6-11a6 6 0 0112 0c0 5.4-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></svg>;
  }
};

export const Social = ({ name, className = "h-4 w-4" }: P & { name: "instagram" | "facebook" | "x" }) => {
  if (name === "instagram")
    return <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><path d="M17 7v.01" /></svg>;
  if (name === "facebook")
    return <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.4 1.5-1.4h1.4V5.1A19 19 0 0014.3 5c-2 0-3.4 1.2-3.4 3.5V11H8.5v3h2.4v7z" /></svg>;
  return <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor"><path d="M17.5 4h2.8l-6.1 7 7.2 9h-5.6l-4.4-5.6L6.3 20H3.5l6.5-7.5L3.1 4h5.7l4 5.2zM16.5 18.4h1.6L7.6 5.5H5.9z" /></svg>;
};

export const Google = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 01-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.7z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0012 24z" />
    <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 010-4.6V6.6H1.3a12 12 0 000 10.8z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 001.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
  </svg>
);
