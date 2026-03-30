"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { OrderDTO } from "@/lib/types";
import { LinkButton } from "@/components/ui/link-button";

const STORAGE_KEY = "kart-last-order";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderDTO | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as OrderDTO;
      if (orderIdParam && parsed.id === orderIdParam) {
        queueMicrotask(() => setOrder(parsed));
      } else if (!orderIdParam && parsed.id) {
        queueMicrotask(() => setOrder(parsed));
      }
    } catch {
      /* ignore */
    }
  }, [orderIdParam]);

  const displayId = order?.id ?? orderIdParam ?? "—";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="rounded-2xl border border-border bg-surface p-10 sm:p-12">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">
          Thank you
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Order confirmed
        </h1>
        <p className="mt-4 text-foreground-muted">
          Your order has been placed successfully. Save your reference below.
        </p>
        <div className="mt-10 rounded-xl border border-border-strong bg-page px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Order reference
          </p>
          <p className="mt-2 font-mono text-lg text-foreground break-all">
            {displayId}
          </p>
        </div>
        {order?.couponCode ? (
          <p className="mt-6 text-sm text-foreground-muted">
            Coupon applied:{" "}
            <span className="font-medium text-accent">{order.couponCode}</span>
          </p>
        ) : null}
        {order?.items && order.items.length > 0 ? (
          <ul className="mt-8 space-y-2 text-left text-sm">
            {order.items.map((item) => {
              const p = order.products?.find((x) => x.id === item.productId);
              const name = p?.name ?? item.productId;
              return (
                <li
                  key={`${item.productId}-${item.quantity}`}
                  className="flex justify-between border-b border-border py-2 last:border-0"
                >
                  <span className="text-foreground-muted">{name}</span>
                  <span className="text-foreground">
                    ×{item.quantity}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <LinkButton href="/menu" className="min-w-[160px] px-8">
            Back to menu
          </LinkButton>
          <LinkButton href="/" variant="secondary" className="min-w-[160px] px-8">
            Home
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">
          Loading…
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
