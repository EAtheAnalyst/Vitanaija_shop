import type { Metadata } from "next";
import { auth } from "@/auth";
import { hasGoogle } from "@/lib/env";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const session = await auth().catch(() => null);
  const user = session?.user?.email ? { name: session.user.name ?? "", email: session.user.email } : null;
  return (
    <section className="container-x pb-24 pt-[120px] md:pt-[140px]">
      <CheckoutForm user={user} googleEnabled={hasGoogle} />
    </section>
  );
}
