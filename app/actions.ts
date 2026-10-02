"use server";

import { z } from "zod";
import { store } from "@/lib/db";

export type FormState = { status: "idle" | "success" | "exists" | "error"; message?: string };

const emailSchema = z.string().trim().toLowerCase().email("Please enter a valid email address.");

export async function subscribe(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const source = String(formData.get("source") ?? "home").slice(0, 20);
  try {
    const result = await store.addSubscriber(parsed.data, source);
    return result === "exists"
      ? { status: "exists", message: "You're already on the list. Thank you!" }
      : { status: "success", message: "You're in. Check your inbox soon." };
  } catch (err) {
    console.error("[subscribe]", err);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: emailSchema,
  message: z.string().trim().min(10, "Please write at least 10 characters.").max(2000),
});

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  try {
    await store.addMessage(parsed.data);
    return { status: "success", message: "Thanks! We'll reply within one working day." };
  } catch (err) {
    console.error("[contact]", err);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
