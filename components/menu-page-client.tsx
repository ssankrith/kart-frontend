"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function MenuPageClient() {
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
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Menu
      </h1>
      <p className="mt-2 text-foreground-muted">
        Choose a dessert — open an item to add it to your cart.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const img = p.image?.thumbnail ?? p.image?.mobile;
          return (
            <li key={p.id}>
              <Card className="overflow-hidden p-0 transition-shadow hover:shadow-md">
                <Link href={`/menu/${p.id}`} className="block">
                  {img ? (
                    <div className="relative aspect-[4/3] w-full bg-surface-muted">
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-surface-muted" />
                  )}
                  <div className="p-4">
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="mt-1 text-sm text-muted">{p.category}</p>
                    <p className="mt-2 text-sm font-semibold text-accent">
                      ${p.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
