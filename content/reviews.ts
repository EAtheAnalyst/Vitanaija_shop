import type { Review } from "./types";

// SAMPLE reviews for local development only. They are never shown in production:
// production shows approved rows from the `reviews` table, and hides the section if none exist.
export const sampleReviews: Review[] = [
  { id: "s1", name: "Sample customer", city: "Lagos", rating: 5, text: "Placeholder review. Replace with a real, verified customer review before launch.", sample: true },
  { id: "s2", name: "Sample customer", city: "Abuja", rating: 5, text: "Placeholder review. Short quotes work best in the stacked middle column.", sample: true },
  { id: "s3", name: "Sample customer", city: "Port Harcourt", rating: 5, text: "Placeholder review. Real reviews are approved in Supabase by setting approved = true.", sample: true },
  { id: "s4", name: "Sample customer", city: "Ibadan", rating: 5, text: "Placeholder review. Keep the customer's first name and city only, with their permission.", sample: true },
];
