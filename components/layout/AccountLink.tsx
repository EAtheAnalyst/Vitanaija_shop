import Link from "next/link";
import { auth } from "@/auth";

export async function AccountLink() {
  const session = await auth().catch(() => null);
  const user = session?.user;
  if (!user) {
    return (
      <Link href="/signin" className="text-[14px] font-medium text-ink transition-opacity duration-[280ms] hover:opacity-70">
        Sign in
      </Link>
    );
  }
  const initial = (user.name ?? user.email ?? "?").charAt(0).toUpperCase();
  return (
    <Link href="/account" className="flex items-center gap-2 text-[14px] font-medium text-ink" aria-label="Your account">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[13px] text-paper">{initial}</span>
      <span className="md:sr-only lg:not-sr-only">Account</span>
    </Link>
  );
}
