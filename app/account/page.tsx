import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { store } from "@/lib/db";
import { formatDate, formatNaira } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, RevealChild, RevealGroup } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default async function AccountPage() {
  const session = await auth().catch(() => null);
  const email = session?.user?.email;
  if (!email) redirect("/signin?callbackUrl=/account");
  const orders = await store.listOrdersByEmail(email);

  return (
    <section className="container-x pb-24 pt-[120px] md:pt-[150px]">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="h2 mt-3">Hello, {session.user?.name?.split(" ")[0] ?? "there"}</h1>
          <p className="mt-2 text-[14px] text-body">{email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className="link-underline text-[13px] font-medium text-ink">Sign out</button>
        </form>
      </Reveal>

      <h2 className="mt-14 text-[22px] text-ink">Your orders</h2>
      {orders.length === 0 ? (
        <div className="mt-6 rounded-[8px] bg-surface-2 p-8 text-center">
          <p className="text-body">You haven't placed an order yet.</p>
          <ButtonLink href="/shop" className="mt-6">Start shopping</ButtonLink>
        </div>
      ) : (
        <RevealGroup as="ul" className="mt-6 space-y-4" stagger={90}>
          {orders.map((o) => (
            <RevealChild as="li" key={o.id}>
              <Link href={`/order/${o.id}`} className="flex flex-wrap items-center justify-between gap-4 rounded-[8px] bg-surface-2 p-5 transition-colors duration-[280ms] hover:bg-surface-1">
                <span>
                  <span className="block text-[15px] font-medium text-ink">{o.number}</span>
                  <span className="text-[13px] text-muted">{formatDate(o.createdAt)} · {o.items.reduce((n, i) => n + i.quantity, 0)} items</span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="rounded-full bg-paper px-3 py-1 text-[12px] font-semibold capitalize text-ink">{o.status}</span>
                  <span className="text-[15px] text-ink">{formatNaira(o.total)}</span>
                </span>
              </Link>
            </RevealChild>
          ))}
        </RevealGroup>
      )}
    </section>
  );
}
