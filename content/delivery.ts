export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

export type NigerianState = (typeof NIGERIAN_STATES)[number];

export const FREE_DELIVERY_FROM = 30000;
export const DELIVERY_FEE_LAGOS = 2000;
export const DELIVERY_FEE_OTHER = 3500;

export function deliveryFee(state: string, subtotal: number) {
  if (subtotal <= 0 || subtotal >= FREE_DELIVERY_FROM) return 0;
  return state === "Lagos" ? DELIVERY_FEE_LAGOS : DELIVERY_FEE_OTHER;
}

export function deliveryEstimate(state: string) {
  if (state === "Lagos") return "1–2 working days";
  if (state === "FCT (Abuja)" || state === "Ogun" || state === "Oyo" || state === "Rivers") return "2–3 working days";
  return "3–5 working days";
}
