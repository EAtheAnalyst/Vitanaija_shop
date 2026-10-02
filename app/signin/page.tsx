import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { hasGoogle } from "@/lib/env";
import { LogoMark } from "@/components/ui/Logo";
import { Google } from "@/components/ui/Icons";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const safePath = (p?: string) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/account");

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const { callbackUrl, error } = await searchParams;
  const to = safePath(callbackUrl);
  const session = await auth().catch(() => null);
  if (session?.user) redirect(to);

  return (
    <section className="grid min-h-[80vh] place-items-center bg-surface-2 px-5 pb-20 pt-[120px]">
      <div className="w-full max-w-[420px] rounded-[8px] bg-paper p-8 text-center md:p-10">
        <LogoMark className="mx-auto h-10 w-10" />
        <h1 className="h2 mt-6">Welcome back</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-body">Sign in to track your orders and check out faster.</p>
        {error ? <p role="alert" className="mt-4 text-[13px] text-danger">Sign-in didn't work. Please try again.</p> : null}
        {hasGoogle ? (
          <form
            className="mt-8"
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: to });
            }}
          >
            <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full border border-ink/15 bg-paper text-[14px] font-medium text-ink transition-colors duration-[280ms] hover:bg-surface-2">
              <Google className="h-5 w-5" /> Continue with Google
            </button>
          </form>
        ) : (
          <p className="mt-8 rounded-[8px] bg-surface-2 p-4 text-[13px] leading-relaxed text-body">
            Google sign-in isn't set up yet. Add <code>AUTH_GOOGLE_ID</code> and <code>AUTH_GOOGLE_SECRET</code> to <code>.env.local</code> (see README). You can still check out as a guest.
          </p>
        )}
        <p className="mt-6 text-[12px] text-muted">You don't need an account to order.</p>
      </div>
    </section>
  );
}
