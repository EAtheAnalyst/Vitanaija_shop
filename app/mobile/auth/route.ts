import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { signAppToken } from "@/lib/app-token";
import { isProd } from "@/lib/env";

// Google sign-in for the mobile app, reusing the website's Google OAuth client:
//   1. The app opens  {site}/mobile/auth?redirect=vitanaija://auth  in an in-app browser.
//   2. If not signed in, the customer goes through the normal /signin → Google flow.
//   3. Back here with a session, we mint a 30-day app token and redirect to the app's deep link.
// Only the app's own schemes may receive a token. Expo Go (exp://) is allowed in development,
// or in production when MOBILE_ALLOW_EXPO_GO=true (for testing a production API from Expo Go).

function allowedRedirect(raw: string | null): string | null {
  if (!raw) return null;
  const allowExpo = !isProd || process.env.MOBILE_ALLOW_EXPO_GO === "true";
  if (raw.startsWith("vitanaija://")) return raw;
  if (allowExpo && raw.startsWith("exp://")) return raw;
  return null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const redirect = allowedRedirect(url.searchParams.get("redirect"));
  if (!redirect) return NextResponse.json({ error: { message: "Invalid app redirect." } }, { status: 400 });

  const session = await auth().catch(() => null);
  const user = session?.user;
  if (!user?.email) {
    const back = `/mobile/auth?redirect=${encodeURIComponent(redirect)}`;
    return NextResponse.redirect(new URL(`/signin?callbackUrl=${encodeURIComponent(back)}`, url.origin));
  }

  const token = await signAppToken({ email: user.email, name: user.name ?? null, image: user.image ?? null });
  const target = `${redirect}${redirect.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
  return NextResponse.redirect(target);
}
