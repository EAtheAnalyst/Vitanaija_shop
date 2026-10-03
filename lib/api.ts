import "server-only";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAppToken, type AppUser } from "@/lib/app-token";

// Shared helpers for the /api/v1 routes used by the mobile app (and the web cart sync).

/** Who is calling: a mobile app token (Authorization: Bearer …) or a web session cookie. */
export async function getApiUser(req: Request): Promise<AppUser | null> {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return verifyAppToken(header.slice(7).trim());
  const session = await auth().catch(() => null);
  const u = session?.user;
  return u?.email ? { email: u.email.toLowerCase(), name: u.name ?? null, image: u.image ?? null } : null;
}

export const json = (data: unknown, init?: number | ResponseInit) =>
  NextResponse.json(data, typeof init === "number" ? { status: init } : init);

export const apiError = (status: number, message: string, extra?: Record<string, unknown>) =>
  NextResponse.json({ error: { message, ...extra } }, { status });

export const unauthorized = () => apiError(401, "Sign in to continue.");
