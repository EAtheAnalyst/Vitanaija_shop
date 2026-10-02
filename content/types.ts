export type Link = { label: string; href: string };

export type Tint = "lavender" | "peach" | "sky" | "blush" | "mint" | "sun";

export type Goal = "energy" | "immunity" | "joints" | "gut" | "skin" | "sleep";

export type Brand = {
  name: string;
  /** Two parts of the wordmark: first part ink, second part accent (e.g. "Vita" + "Naija"). */
  wordmark: [string, string];
  tagline: string;
  email: { info: string; press: string };
  phone: string;
  social: { instagram?: string; facebook?: string; x?: string };
  currency: "NGN";
  locale: string;
};

export type Product = {
  slug: string;
  name: string;
  /** Second line on the bottle label. */
  subtitle: string;
  price: number; // naira, whole units
  size: string; // e.g. "60 capsules"
  count: number; // number on the label
  tint: Tint;
  goal: Goal;
  short: string;
  long: string;
  features: string[];
  usage: string;
  warnings: string;
  inStock: boolean;
  bestSeller?: boolean;
};

export type Review = {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  /** True for placeholder copy that must never be shown in production. */
  sample?: boolean;
};

export type Benefit = { icon: "flask" | "leaf" | "shield" | "truck" | "cash" | "map"; title: string; text: string };

export type Ingredient = { name: string; form: string; texture: "droplet" | "bubbles" | "powder" | "cream" | "granules"; productSlug: string };

export type Home = {
  hero: { headline: [string, string]; underline: string; sub: string; cta: Link };
  mission: string;
  bestSellers: { title: string; productSlugs: string[]; viewAll: Link };
  about: { eyebrow: string; title: [string, string]; body: string[]; closer: [string, string]; cta: Link };
  benefits: { eyebrow: string; title: string; items: Benefit[] };
  guarantee: { title: [string, string]; body: string; bold: string };
  featured: { eyebrow: string; title: string; body: string; productSlug: string; cta: Link };
  ingredients: { eyebrow: string; title: string; intro: string; cards: Ingredient[] };
  testimonials: { eyebrow: string; title: [string, string]; viewAll: Link };
  newsletter: { eyebrow: string; title: [string, string]; body: string };
};
