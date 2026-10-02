"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { NIGERIAN_STATES, FREE_DELIVERY_FROM, deliveryEstimate, deliveryFee } from "@/content/delivery";
import { Bottle } from "@/components/art/Bottle";
import { useCart } from "@/components/commerce/CartProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Google } from "@/components/ui/Icons";
import { formatNaira } from "@/lib/format";
import { placeOrder, type CheckoutState } from "./actions";

type Props = { user: { name: string; email: string } | null; googleEnabled: boolean };

export function CheckoutForm({ user, googleEnabled }: Props) {
  const { lines, subtotal, ready, clear } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, { status: "idle" });
  const [region, setRegion] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (state.status === "ok") {
      clear();
      router.push(`/order/${state.orderId}?placed=1`);
    }
  }, [state, clear, router]);

  if (!ready) return <div className="h-[60vh]" aria-busy="true" />;

  if (lines.length === 0 && state.status !== "ok") {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="h2">Your cart is empty</h1>
        <p className="mt-4 text-body">Add a product to start your order.</p>
        <ButtonLink href="/shop" className="mt-8">Go to shop</ButtonLink>
      </div>
    );
  }

  const fee = region ? deliveryFee(region, subtotal) : null;
  const total = subtotal + (fee ?? 0);
  const err = state.status === "error" ? state.fields ?? {} : {};
  const cartJson = JSON.stringify(lines.map((l) => ({ slug: l.slug, qty: l.qty })));

  return (
    <form
      noValidate
      className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]"
      onSubmit={(e) => {
        // Submitting via startTransition (not <form action>) keeps the typed values if validation fails.
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="cart" value={cartJson} />
      <div className="space-y-10">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="h2 mt-3">Where should we deliver?</h1>
          <p className="mt-3 text-[14px] text-body">No card needed. You pay the rider when your order arrives.</p>
        </div>

        {!user && googleEnabled ? (
          <div className="flex flex-wrap items-center gap-4 rounded-[8px] bg-surface-2 p-5 text-[14px] text-body">
            <span className="flex-1">Have an account? Sign in to fill in your details and track orders.</span>
            <Link href="/signin?callbackUrl=/checkout" className="inline-flex h-10 items-center gap-2 rounded-full bg-paper px-5 text-[13px] font-medium text-ink">
              <Google /> Sign in with Google
            </Link>
          </div>
        ) : null}

        {state.status === "error" ? (
          <div role="alert" className="rounded-[8px] border border-danger/30 bg-danger/5 p-4 text-[14px] text-danger">{state.message}</div>
        ) : null}

        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-4 text-[17px] font-medium text-ink">Contact</legend>
          <Field label="Full name" name="name" autoComplete="name" defaultValue={user?.name} error={err.name} className="sm:col-span-2" />
          <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={user?.email} error={err.email} hint="We'll send your order confirmation here." />
          <Field label="Phone number" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="0803 123 4567" error={err.phone} hint="The rider will call this number." />
        </fieldset>

        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-4 text-[17px] font-medium text-ink">Delivery address</legend>
          <Field label="Street address" name="address" autoComplete="street-address" placeholder="12 Adeola Odeku Street" error={err.address} className="sm:col-span-2" />
          <Field label="City or town" name="city" autoComplete="address-level2" placeholder="Victoria Island" error={err.city} />
          <div>
            <label htmlFor="state" className="mb-2 block text-[13px] font-medium text-ink">State</label>
            <select id="state" name="state" className="field" defaultValue="" onChange={(e) => setRegion(e.target.value)} aria-invalid={Boolean(err.state)} aria-describedby="state-msg" autoComplete="address-level1">
              <option value="" disabled>Choose a state</option>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <p id="state-msg" className="mt-1.5 min-h-[1.1rem] text-[12px] text-danger">{err.state ?? ""}</p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="mb-2 block text-[13px] font-medium text-ink">Delivery notes <span className="text-muted">(optional)</span></label>
            <textarea id="notes" name="notes" rows={3} maxLength={300} placeholder="Landmark, gate colour, best time to call…" className="field" />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-[17px] font-medium text-ink">Payment</legend>
          <label className="flex items-start gap-4 rounded-[8px] border-2 border-ink bg-paper p-5">
            <input type="radio" name="payment" value="pay_on_delivery" defaultChecked className="mt-1 accent-[var(--c-ink)]" />
            <span>
              <span className="block text-[15px] font-medium text-ink">Pay on delivery</span>
              <span className="mt-1 block text-[13px] text-body">Pay the rider by cash, card (POS) or bank transfer when your order arrives. We'll call to confirm before dispatch.</span>
            </span>
          </label>
        </fieldset>
      </div>

      <aside className="h-fit rounded-[8px] bg-surface-2 p-6 md:p-8 lg:sticky lg:top-[110px]">
        <h2 className="text-[20px] text-ink">Order summary</h2>
        <ul className="mt-6 space-y-4">
          {lines.map((l) => (
            <li key={l.slug} className="flex items-center gap-4">
              <span className="relative grid h-16 w-14 shrink-0 place-items-center bg-surface-1">
                <Bottle id={`co-${l.slug}`} name={l.name} tint={l.tint} count={l.count} className="h-[70%]" />
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-paper">{l.qty}</span>
              </span>
              <span className="flex-1 text-[14px] text-ink">{l.name}<span className="block text-[12px] text-muted">{l.subtitle}</span></span>
              <span className="text-[14px] text-ink">{formatNaira(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-3 border-t border-ink/10 pt-5 text-[14px]">
          <div className="flex justify-between text-body"><dt>Subtotal</dt><dd>{formatNaira(subtotal)}</dd></div>
          <div className="flex justify-between text-body">
            <dt>Delivery</dt>
            <dd>{fee === null ? "Choose a state" : fee === 0 ? "Free" : formatNaira(fee)}</dd>
          </div>
          {region ? <div className="text-[12px] text-muted">Arrives in about {deliveryEstimate(region)}.</div> : null}
          {subtotal < FREE_DELIVERY_FROM ? <div className="text-[12px] text-muted">Free delivery on orders over {formatNaira(FREE_DELIVERY_FROM)}.</div> : null}
          <div className="flex justify-between border-t border-ink/10 pt-4 text-[17px] text-ink"><dt>Total on delivery</dt><dd>{formatNaira(total)}</dd></div>
        </dl>
        <Button type="submit" disabled={pending} className="mt-6 w-full">{pending ? "Placing order…" : "Place order"}</Button>
        <p className="mt-4 text-center text-[12px] text-muted">
          By placing your order you agree to our <Link href="/terms" className="underline">terms</Link> and <Link href="/returns" className="underline">returns policy</Link>.
        </p>
      </aside>
    </form>
  );
}

function Field({
  label, name, error, hint, className = "", ...rest
}: { label: string; name: string; error?: string; hint?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-ink">{label}</label>
      <input id={id} name={name} required aria-invalid={Boolean(error)} aria-describedby={`${id}-msg`} className="field" {...rest} />
      <p id={`${id}-msg`} className={`mt-1.5 min-h-[1.1rem] text-[12px] ${error ? "text-danger" : "text-muted"}`}>{error ?? hint ?? ""}</p>
    </div>
  );
}
