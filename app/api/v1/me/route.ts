import { getApiUser, json, unauthorized } from "@/lib/api";

/** The signed-in user behind a Bearer token or web session. The app calls this to check its token. */
export async function GET(req: Request) {
  const user = await getApiUser(req);
  return user ? json({ user }) : unauthorized();
}
