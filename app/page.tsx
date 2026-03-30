import { FeaturedProducts } from "@/components/featured-products";
import { LinkButton } from "@/components/ui/link-button";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Desserts & more
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Order dessert, delivered simple
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-foreground-muted">
          Browse our menu, build your cart, and place an order in a few clicks.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LinkButton
            href="/menu"
            className="min-w-[180px] px-8 py-3 text-base"
          >
            Browse menu
          </LinkButton>
          <LinkButton
            href="/cart"
            variant="secondary"
            className="min-w-[180px] px-8 py-3 text-base"
          >
            View cart
          </LinkButton>
        </div>
      </section>

      <FeaturedProducts />
    </>
  );
}
