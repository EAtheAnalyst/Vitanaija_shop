import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { hasGoogle } from "@/lib/env";
import { store } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Google is only registered when keys exist, so the site still runs before setup.
  providers: hasGoogle ? [Google] : [],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  trustHost: true,
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      try {
        await store.upsertCustomer({
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
          googleId: account?.providerAccountId ?? null,
        });
      } catch (err) {
        // Don't block sign-in if the database is briefly unavailable.
        console.error("[auth] could not save customer", err);
      }
      return true;
    },
  },
});
