"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Card } from "@/components/ui/card";
import { CartLinesList } from "@/components/cart-lines-list";
import { OrderSummaryCheckout } from "@/components/order-summary-checkout";
import { MenuProductQuantityPill } from "@/components/menu-product-quantity-pill";
import { ResponsiveProductImage } from "@/components/responsive-product-image";
import { useCart } from "@/contexts/cart-context";

export function MenuPageClient() {
  const { totalCount, lines } = useCart();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load products.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-foreground">Menu</h1>
        <p className="mt-4 text-foreground-muted">{error}</p>
        <p className="mt-2 text-sm text-muted">
          Set{" "}
          <code className="rounded bg-surface-muted px-1">
            NEXT_PUBLIC_API_BASE_URL
          </code>{" "}
          and ensure the backend allows your origin via{" "}
          <code className="rounded bg-surface-muted px-1">CORS_ORIGINS</code>.
        </p>
      </div>
    );
  }

  if (products === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Menu
        </h1>
        <p className="mt-2 text-foreground-muted">Loading menu…</p>
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start">
          <ul className="grid min-w-0 flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <li key={i}>
                <Card className="animate-pulse overflow-hidden p-0">
                  <div className="aspect-[4/3] bg-surface-muted" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-[75%] rounded bg-surface-muted" />
                    <div className="h-3 w-1/2 rounded bg-surface-muted" />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
          <div className="hidden w-full shrink-0 animate-pulse rounded-xl border border-border bg-surface-muted p-6 lg:block lg:w-[360px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Menu
      </h1>
      <p className="mt-2 text-foreground-muted">
        Add desserts to your cart and place your order from this page.
      </p>

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
        <div className="min-w-0 flex-1">
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => {
              const lineQty =
                lines.find((l) => l.productId === p.id)?.quantity ?? 0;
              return (
                <li key={p.id}>
                  <Card className="flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
                    <Link
                      href={`/menu/${p.id}`}
                      className="relative block shrink-0 aspect-[4/3] w-full bg-surface-muted"
                    >
                      {p.image ? (
                        <ResponsiveProductImage
                          image={p.image}
                          alt={p.name}
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 280px"
                        />
                      ) : (
                        <div className="aspect-[4/3] w-full bg-surface-muted" />
                      )}
                    </Link>
                    <Link
                      href={`/menu/${p.id}`}
                      className="block px-4 pb-3 pt-4"
                    >
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="mt-1 text-sm text-muted">{p.category}</p>
                      <p className="mt-2 text-sm font-semibold text-accent">
                        ${p.price.toFixed(2)}
                      </p>
                    </Link>
                    <div className="mt-auto border-t border-border px-4 pb-4 pt-3">
                      {lineQty === 0 ? (
                        <AddToCartButton
                          product={p}
                          className="w-full py-2.5"
                          label="Add to cart"
                        />
                      ) : (
                        <MenuProductQuantityPill product={p} fullWidth />
                      )}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-20 lg:w-[360px] lg:max-w-[360px]">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                Your cart
              </h2>
              {totalCount > 0 ? (
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                  {totalCount} {totalCount === 1 ? "item" : "items"}
                </span>
              ) : null}
            </div>
            {totalCount === 0 ? (
              <p className="mt-4 text-sm text-foreground-muted">
                Your cart is empty. Use{" "}
                <span className="font-medium text-foreground">Add to cart</span>{" "}
                on any dessert to build your order here.
              </p>
            ) : (
              <div className="mt-4 max-h-[min(50vh,420px)] overflow-y-auto pr-1">
                <CartLinesList variant="compact" />
              </div>
            )}
          </div>

          <OrderSummaryCheckout
            footerLink={{ href: "/cart", label: "Open full cart" }}
          />
        </aside>
      </div>
    </div>
  );
}
