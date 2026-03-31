"use client";

import { useCart } from "@/contexts/cart-context";
import { CartLinesList } from "@/components/cart-lines-list";
import { LinkButton } from "@/components/ui/link-button";
import { OrderSummaryCheckout } from "@/components/order-summary-checkout";

export function CartPageClient() {
  const { totalCount } = useCart();

  if (totalCount === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12">
          <h1 className="text-2xl font-semibold text-foreground">
            Your cart is empty
          </h1>
          <p className="mt-3 text-foreground-muted">
            Add something sweet from the menu — we&apos;ll hold it here.
          </p>
          <LinkButton href="/menu" className="mt-8 px-8">
            Browse menu
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Your cart
      </h1>
      <p className="mt-2 text-foreground-muted">
        Review items and apply a coupon before checkout.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
        <CartLinesList variant="full" />

        <OrderSummaryCheckout
          footerLink={{ href: "/menu", label: "Continue shopping" }}
        />
      </div>
    </div>
  );
}
