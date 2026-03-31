"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ResponsiveProductImage } from "@/components/responsive-product-image";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((all) => {
        if (!cancelled) setProducts(all.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (products === null || products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-xl font-semibold text-foreground">
        Featured treats
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-center text-sm text-foreground-muted">
        From our menu — add to cart on the product page.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          return (
            <li key={p.id}>
              <Card className="overflow-hidden p-0">
                <Link href={`/menu/${p.id}`} className="block">
                  {p.image ? (
                    <div className="relative aspect-[4/3] w-full bg-surface-muted">
                      <ResponsiveProductImage
                        image={p.image}
                        alt={p.name}
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
    </section>
  );
}
