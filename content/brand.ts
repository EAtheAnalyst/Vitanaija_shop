import type { Brand } from "./types";

// Placeholder brand. Rename here and in app/globals.css (colour tokens) to rebrand.
export const brand: Brand = {
  name: "VitaNaija",
  wordmark: ["vita", "naija"],
  tagline: "Everyday supplements made for Nigerian lives.",
  email: { info: "hello@vitanaija.ng", press: "press@vitanaija.ng" },
  phone: "+234 800 000 0000",
  social: { instagram: "https://instagram.com", facebook: "https://facebook.com", x: "https://x.com" },
  currency: "NGN",
  locale: "en-NG",
};

export const nav = [
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Reviews", href: "/#reviews" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

export const footer = {
  tour: [
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
    { label: "Reviews", href: "/#reviews" },
    { label: "FAQ", href: "/faq" },
  ],
  company: [
    { label: "Contact Us", href: "/contact" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Returns & Delivery", href: "/returns" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};
