import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center bg-surface-2 px-5 pt-[100px] text-center">
      <div>
        <span className="leaf mx-auto block h-20 w-24 bg-surface-1" aria-hidden />
        <p className="eyebrow mt-8">404</p>
        <h1 className="h2 mt-3">We couldn't find that page</h1>
        <p className="mx-auto mt-4 max-w-[380px] text-[15px] text-body">It may have moved, or the link might be wrong.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/shop">Shop best sellers</ButtonLink>
          <ButtonLink href="/" variant="light" arrow={false}>Go home</ButtonLink>
        </div>
      </div>
    </section>
  );
}
