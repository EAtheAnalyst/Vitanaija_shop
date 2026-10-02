import type { Home } from "./types";

// [CLAIM — needs evidence] marks copy that must be verified before launch.
export const home: Home = {
  hero: {
    headline: ["Choose", "a Better You"],
    underline: "Better",
    sub: "Feel better with VitaNaija, the supplements you need for all-round health and wellness, delivered anywhere in Nigeria.",
    cta: { label: "Shop now", href: "/shop" },
  },
  mission: "Pay on delivery · Delivery to all 36 states and the FCT · 30-day money-back promise",
  bestSellers: {
    title: "Best Sellers",
    productSlugs: ["magnesium-complex", "multivitamin", "glucosamine", "niacinamide"],
    viewAll: { label: "View all", href: "/shop" },
  },
  about: {
    eyebrow: "About VitaNaija",
    title: ["Supercharge", "Your Health"],
    body: [
      "We do things a bit differently at VitaNaija. We build balanced formulas around the way Nigerians actually live: long commutes, hot afternoons, busy markets and big family meals.",
      "From supporting a healthy gut with our Probiotic Complex to everyday energy from our Multivitamin, we've got the supplements you need.",
    ],
    closer: ["We offer choice, reliability and value.", "That's what makes us Better."],
    cta: { label: "Shop now", href: "/shop" },
  },
  benefits: {
    eyebrow: "Why VitaNaija",
    title: "Benefits of VitaNaija",
    items: [
      // [CLAIM — needs evidence] confirm study references before launch
      { icon: "flask", title: "Studied Ingredients", text: "Well-researched ingredients you can actually pronounce." },
      { icon: "leaf", title: "Vegetarian Friendly", text: "Vegetarian options across most of our range." },
      // [CLAIM — needs evidence] show the NAFDAC number on every product once issued
      { icon: "shield", title: "NAFDAC Registration", text: "Every product goes through NAFDAC registration before sale." },
      { icon: "cash", title: "Pay on Delivery", text: "Pay by cash, card or transfer when your order arrives." },
      { icon: "map", title: "Nationwide Delivery", text: "Delivery to all 36 states and the FCT." },
      { icon: "truck", title: "Free Delivery", text: "Free delivery on orders over ₦30,000." },
    ],
  },
  guarantee: {
    title: ["Feel Better", "Or Your Money Back"],
    body: "We believe choosing the right supplement shouldn't come with a risk. If you are not satisfied for any reason, we offer",
    bold: "a full 30-day money-back promise, no questions asked.",
  },
  featured: {
    eyebrow: "Best seller",
    title: "Start Feeling Better",
    body: "Start with a formula built for your day. Pay only when it reaches your door, with a 30-day money-back promise.",
    productSlug: "niacinamide",
    cta: { label: "Buy now", href: "/products/niacinamide" },
  },
  ingredients: {
    eyebrow: "Ingredients",
    title: "Better Ingredients",
    intro: "Every formula starts with a short list of well-studied ingredients, in forms your body can use.",
    cards: [
      { name: "Vitamin C", form: "Vitamin C as ascorbic acid", texture: "droplet", productSlug: "vitamin-c-zinc" },
      { name: "Vitamin B3", form: "Niacinamide", texture: "bubbles", productSlug: "niacinamide" },
      { name: "Magnesium", form: "Chelated form of magnesium", texture: "powder", productSlug: "magnesium-complex" },
      { name: "Hyaluronic Acid", form: "Hyaluronic acid 2%", texture: "cream", productSlug: "niacinamide" },
      { name: "Lactobacillus", form: "Lactobacillus complex", texture: "granules", productSlug: "probiotic-complex" },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: ["Loved by customers", "across Nigeria"],
    viewAll: { label: "View all", href: "/reviews" },
  },
  newsletter: {
    eyebrow: "Newsletter",
    title: ["Take Charge of Your", "Health Today"],
    body: "We'll send you updates to keep you well-informed about how to be the best you. Just in case you decide to leave it till tomorrow…",
  },
};
