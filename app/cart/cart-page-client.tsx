"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import type { OrderDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkButton } from "@/components/ui/link-button";

const STORAGE_KEY = "kart-last-order";

export function CartPageClient() {
  const router = useRouter();
  const { lines, setQuantity, removeLine, totalCount, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = lines.reduce(
    (s, l) => s + l.product.price * l.quantity,
    0
  );

  async function checkout() {
    setError(null);
    setSubmitting(true);
    try {
      const body = {
        items: lines.map((l) => ({
          productId: l.productId,
          quantity: l.quantity,
        })),
        couponCode: coupon.trim() || undefined,
      };
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as OrderDTO | { code?: string; message?: string };
      if (!res.ok) {
        const msg =
          "message" in data && data.message
            ? data.message
            : "Order could not be placed.";
        setError(msg);
        setSubmitting(false);
        return;
      }
      const order = data as OrderDTO;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
      clear();
      router.push(`/order/success?orderId=${encodeURIComponent(order.id)}`);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

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
        <ul className="space-y-4">
          {lines.map((line) => {
            const img =
              line.product.image?.thumbnail ?? line.product.image?.mobile;
            return (
              <li
                key={line.productId}
                className="flex gap-4 rounded-xl border border-border bg-surface p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                  {img ? (
                    <Image
                      src={img}
                      alt={line.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/menu/${line.productId}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {line.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    ${line.product.price.toFixed(2)} each
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-foreground-muted">
                      Qty
                      <select
                        className="rounded-lg border border-border bg-surface px-2 py-1 text-foreground"
                        value={line.quantity}
                        onChange={(e) =>
                          setQuantity(
                            line.productId,
                            Number.parseInt(e.target.value, 10)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-accent hover:underline"
                      onClick={() => removeLine(line.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-semibold text-foreground">
                  ${(line.product.price * line.quantity).toFixed(2)}
                </p>
              </li>
            );
          })}
        </ul>

        <aside className="rounded-xl border border-border-strong bg-surface-muted p-6">
          <h2 className="text-lg font-semibold text-foreground">Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-foreground-muted">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="mt-6">
            <label
              htmlFor="coupon"
              className="text-sm font-medium text-foreground-muted"
            >
              Coupon code
            </label>
            <Input
              id="coupon"
              className="mt-2"
              placeholder="Optional"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              autoComplete="off"
            />
          </div>
          {error ? (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="button"
            className="mt-6 w-full py-3 text-base"
            disabled={submitting}
            onClick={() => void checkout()}
          >
            {submitting ? "Placing order…" : "Checkout"}
          </Button>
          <p className="mt-4 text-center text-xs text-muted">
            <Link href="/menu" className="hover:text-accent">
              Continue shopping
            </Link>
          </p>
        </aside>
      </div>
    </div>
  );
}
