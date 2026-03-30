"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProduct } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { LinkButton } from "@/components/ui/link-button";

export function ProductDetailClient() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetchProduct(id)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setProduct(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error || product === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <p className="text-foreground-muted">
          {error ? "Could not load product." : "Product not found."}
        </p>
        <LinkButton href="/menu" variant="secondary" className="mt-6">
          Back to menu
        </LinkButton>
      </div>
    );
  }

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="h-4 w-32 animate-pulse rounded bg-surface-muted" />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="aspect-square max-w-xl animate-pulse rounded-2xl bg-surface-muted lg:max-w-none" />
          <div className="space-y-4">
            <div className="h-6 w-24 animate-pulse rounded bg-surface-muted" />
            <div className="h-10 w-full max-w-md animate-pulse rounded bg-surface-muted" />
            <div className="h-8 w-28 animate-pulse rounded bg-surface-muted" />
          </div>
        </div>
      </div>
    );
  }

  const img =
    product.image?.desktop ??
    product.image?.tablet ??
    product.image?.mobile ??
    product.image?.thumbnail;

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
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-cover"
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
