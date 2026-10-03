import { z } from "zod";
import { store } from "@/lib/db";
import { apiError, json } from "@/lib/api";

const schema = z.object({ email: z.string().trim().toLowerCase().email("Please enter a valid email address.") });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return apiError(400, parsed.error.issues[0]?.message ?? "Invalid email.");
  try {
    const result = await store.addSubscriber(parsed.data.email, "app");
    return json({ status: result, message: result === "exists" ? "You're already on the list. Thank you!" : "You're in. Check your inbox soon." });
  } catch (err) {
    console.error("[api/newsletter]", err);
    return apiError(500, "Something went wrong. Please try again.");
  }
}
