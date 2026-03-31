"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import type { OrderDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "kart-last-order";

type Props = {
  /** Shown under the checkout button (e.g. cart page “Continue shopping”) */
  footerLink?: { href: string; label: string };
};

export function OrderSummaryCheckout({ footerLink }: Props) {
  const couponId = useId();
  const router = useRouter();
  const { lines, totalCount, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = lines.reduce(
    (s, l) => s + l.product.price * l.quantity,
    0
  );

  async function checkout() {
    if (totalCount === 0) return;
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
      const data = (await res.json()) as
        | OrderDTO
        | { code?: string; message?: string };
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

  return (
    <aside className="rounded-xl border border-border-strong bg-surface-muted p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Summary</h2>
      <div className="mt-4 flex justify-between text-sm text-foreground-muted">
        <span>Subtotal</span>
        <span className="font-medium text-foreground">
          ${subtotal.toFixed(2)}
        </span>
      </div>
      <div className="mt-5">
        <label
          htmlFor={couponId}
          className="text-sm font-medium text-foreground-muted"
        >
          Coupon code
        </label>
        <Input
          id={couponId}
          className="mt-2"
          placeholder="Optional"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          autoComplete="off"
          disabled={totalCount === 0}
        />
      </div>
      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        className="mt-5 w-full py-3 text-base"
        disabled={submitting || totalCount === 0}
        onClick={() => void checkout()}
      >
        {submitting
          ? "Placing order…"
          : totalCount === 0
            ? "Add items to order"
            : "Place order"}
      </Button>
      {footerLink ? (
        <p className="mt-3 text-center text-xs text-muted">
          <Link href={footerLink.href} className="hover:text-accent">
            {footerLink.label}
          </Link>
        </p>
      ) : null}
    </aside>
  );
}
