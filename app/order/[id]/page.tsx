import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deliveryEstimate } from "@/content/delivery";
import { store } from "@/lib/db";
import { formatDate, formatNaira } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Check } from "@/components/ui/Icons";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "Your order", robots: { index: false } };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const statusCopy: Record<string, string> = {
  pending: "Received. We'll call you to confirm.",
  confirmed: "Confirmed and being packed.",
  shipped: "On its way to you.",
  delivered: "Delivered.",
  cancelled: "Cancelled.",
};

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ placed?: string }> }) {
  const { id } = await params;
  const { placed } = await searchParams;
  if (!UUID.test(id)) notFound();
  const order = await store.getOrder(id);
  if (!order) notFound();

  return (
    <section className="bg-surface-2 pb-24 pt-[120px] md:pt-[150px]">
      <div className="container-x max-w-[760px]">
        <Reveal className="text-center">
          {placed ? (
            <span className="leaf mx-auto grid h-16 w-20 place-items-center bg-accent text-paper"><Check className="h-7 w-7" /></span>
          ) : null}
          <p className="eyebrow mt-6">Order {order.number}</p>
          <h1 className="h2 mt-3">{placed ? `Thank you, ${order.name.split(" ")[0]}!` : "Your order"}</h1>
          <p className="mx-auto mt-4 max-w-[460px] text-[15px] leading-[1.75] text-body">
            {placed
              ? `We've emailed a confirmation to ${order.email}. We'll call ${order.phone} to confirm, then deliver in about ${deliveryEstimate(order.state)}.`
              : statusCopy[order.status]}
          </p>
        </Reveal>

        <Reveal delay={150} className="mt-12 rounded-[8px] bg-paper p-6 md:p-10">
          <div className="flex flex-wrap justify-between gap-4 text-[13px] text-muted">
            <span>Placed {formatDate(order.createdAt)}</span>
            <span className="rounded-full bg-surface-2 px-3 py-1 font-semibold capitalize text-ink">{order.status}</span>
          </div>
          <ul className="mt-6 divide-y divide-ink/10">
            {order.items.map((i) => (
              <li key={i.slug} className="flex justify-between py-3 text-[15px] text-ink">
                <span>{i.name} <span className="text-muted">× {i.quantity}</span></span>
                <span>{formatNaira(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-[14px]">
            <div className="flex justify-between text-body"><dt>Subtotal</dt><dd>{formatNaira(order.subtotal)}</dd></div>
            <div className="flex justify-between text-body"><dt>Delivery</dt><dd>{order.deliveryFee ? formatNaira(order.deliveryFee) : "Free"}</dd></div>
            <div className="flex justify-between pt-2 text-[18px] text-ink"><dt>Total to pay on delivery</dt><dd>{formatNaira(order.total)}</dd></div>
          </dl>
          <div className="mt-8 grid gap-6 text-[14px] leading-relaxed text-body sm:grid-cols-2">
            <div>
              <p className="font-semibold text-ink">Delivering to</p>
              <p>{order.name}<br />{order.addressLine1}<br />{order.city}, {order.state}</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Payment</p>
              <p>Pay on delivery by cash, card (POS) or bank transfer.</p>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 text-center">
          <ButtonLink href="/shop">Continue shopping</ButtonLink>
        </div>
      </div>
    </section>
  );
}
