"use client";

import type { Product } from "@/lib/types";

function getPublicBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return url;
}

/** Browser fetch to live kart-backend (requires CORS on server). No static/cache. */
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${getPublicBaseUrl()}/product`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to load products: ${res.status}`);
  }
  return res.json() as Promise<Product[]>;
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(
    `${getPublicBaseUrl()}/product/${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load product: ${res.status}`);
  }
  return res.json() as Promise<Product>;
}
