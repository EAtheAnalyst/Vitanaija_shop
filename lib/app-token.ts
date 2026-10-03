import "server-only";
import { SignJWT, jwtVerify } from "jose";

// Bearer tokens for the mobile app. Signed with AUTH_SECRET (HS256), so no extra secret is needed.
// The app gets one after signing in with Google on the website (see app/mobile/auth/route.ts).

export type AppUser = { email: string; name: string | null; image: string | null };

const ISSUER = "vitanaija";
const AUDIENCE = "vitanaija-mobile";
const TTL = "30d";

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function signAppToken(user: AppUser) {
  return new SignJWT({ name: user.name, image: user.image })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.email.toLowerCase())
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(TTL)
    .sign(secret());
}

export async function verifyAppToken(token: string): Promise<AppUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: ISSUER, audience: AUDIENCE, algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      email: payload.sub,
      name: typeof payload.name === "string" ? payload.name : null,
      image: typeof payload.image === "string" ? payload.image : null,
    };
  } catch {
    return null;
  }
}
