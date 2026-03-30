import { LinkButton } from "@/components/ui/link-button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Not found</h1>
      <p className="mt-3 text-foreground-muted">
        We couldn&apos;t find that page or product.
      </p>
      <LinkButton href="/menu" className="mt-8">
        Browse menu
      </LinkButton>
    </div>
  );
}
