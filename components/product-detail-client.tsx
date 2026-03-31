"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ResponsiveProductImage } from "@/components/responsive-product-image";
import { LinkButton } from "@/components/ui/link-button";

export function ProductDetailClient({ product }: { product: Product }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/menu"
        className="text-sm font-medium text-accent hover:underline"
      >
        ← Back to menu
      </Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface-muted lg:max-w-none">
          {product.image ? (
            <ResponsiveProductImage
              image={product.image}
              alt={product.name}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : null}
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-6 text-3xl font-semibold text-accent">
            ${product.price.toFixed(2)}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <AddToCartButton product={product} />
            <LinkButton href="/cart" variant="secondary">
              Go to cart
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
