"use client";

import { useActionState, useId } from "react";
import { subscribe, type FormState } from "@/app/actions";
import { ArrowRight } from "./Icons";

const initial: FormState = { status: "idle" };

/** Newsletter form. `compact` is the footer version with the round arrow inside the field. */
export function EmailCapture({ source, compact = false }: { source: string; compact?: boolean }) {
  const [state, action, pending] = useActionState(subscribe, initial);
  const id = useId();
  const done = state.status === "success" || state.status === "exists";

  if (done) {
    return (
      <p role="status" className={`text-ink ${compact ? "text-[14px]" : "text-[16px]"}`}>
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} noValidate className="w-full">
      <input type="hidden" name="source" value={source} />
      <label htmlFor={id} className="sr-only">Email address</label>
      {compact ? (
        <div className="relative max-w-[260px]">
          <input id={id} name="email" type="email" required placeholder="Your e-mail" autoComplete="email" aria-invalid={state.status === "error"} aria-describedby={`${id}-msg`} className="field h-11 pr-12 text-[13px]" />
          <button type="submit" disabled={pending} aria-label="Subscribe" className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-surface-1 text-ink transition-colors duration-[280ms] hover:bg-accent-soft hover:text-paper">
            <ArrowRight />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <input id={id} name="email" type="email" required placeholder="Your e-mail" autoComplete="email" aria-invalid={state.status === "error"} aria-describedby={`${id}-msg`} className="field border-transparent sm:max-w-[260px]" />
          <button type="submit" disabled={pending} className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 text-[12px] font-bold uppercase tracking-[0.08em] text-paper transition-colors duration-[280ms] hover:bg-[#145566] disabled:opacity-60">
            {pending ? "Subscribing…" : "Subscribe"}
            <span className="transition-transform duration-[280ms] ease-soft group-hover:translate-x-1"><ArrowRight /></span>
          </button>
        </div>
      )}
      <p id={`${id}-msg`} role="alert" className="mt-2 min-h-[1.25rem] text-[13px] text-danger">
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
