"use client";

import { startTransition, useActionState } from "react";
import { sendMessage, type FormState } from "@/app/actions";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(sendMessage, { status: "idle" });
  if (state.status === "success") {
    return <p role="status" className="rounded-[8px] bg-surface-2 p-8 text-[16px] text-ink">{state.message}</p>;
  }
  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-2 block text-[13px] font-medium text-ink">Name</label>
          <input id="c-name" name="name" required autoComplete="name" className="field" />
        </div>
        <div>
          <label htmlFor="c-email" className="mb-2 block text-[13px] font-medium text-ink">Email</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="c-msg" className="mb-2 block text-[13px] font-medium text-ink">Message</label>
        <textarea id="c-msg" name="message" rows={6} required className="field" />
      </div>
      <p role="alert" className="min-h-[1.25rem] text-[13px] text-danger">{state.status === "error" ? state.message : ""}</p>
      <Button type="submit" disabled={pending}>{pending ? "Sending…" : "Send message"}</Button>
    </form>
  );
}
