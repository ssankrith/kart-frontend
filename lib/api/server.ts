import type { Product } from "@/lib/types";

function getBaseUrl(): string {
  const url = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!url) {
    throw new Error("API_BASE_URL is not set");
  }
  return url;
}

/** Server-side fetch for RSC (single request per page; no duplicate client Strict Mode). */
export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(
    `${getBaseUrl()}/product/${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load product: ${res.status}`);
  }
  return res.json() as Promise<Product>;
}
