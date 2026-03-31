"use client";

import type { MouseEvent } from "react";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

/**
 * Figma-style − / qty / + control. `fullWidth` fills the menu card footer (same slot as Add to cart).
 */
export function MenuProductQuantityPill({
  product,
  fullWidth = false,
}: {
  product: Product;
  fullWidth?: boolean;
}) {
  const { lines, addItem, setQuantity, removeLine } = useCart();
  const qty = lines.find((l) => l.productId === product.id)?.quantity ?? 0;

  if (qty < 1) return null;

  function decrement(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (qty <= 1) {
      removeLine(product.id);
    } else {
      setQuantity(product.id, qty - 1);
    }
  }

  function increment(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  }

  return (
    <div
      role="group"
      aria-label={`Quantity for ${product.name}`}
      className={cn(
        "flex items-center gap-1 rounded-full border border-[#B84220]/80 bg-primary shadow-lg ring-2 ring-white/30",
        fullWidth ? "w-full justify-between px-2 py-2.5" : "px-1.5 py-1"
      )}
    >
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-lg font-semibold leading-none text-primary-foreground transition-colors hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
        aria-label="Decrease quantity"
        onClick={decrement}
      >
        <span aria-hidden className="-mt-0.5">
          −
        </span>
      </button>
      <span
        className={cn(
          "select-none text-sm font-semibold tabular-nums text-[#EFAA89]",
          fullWidth ? "min-w-0 flex-1 text-center" : "min-w-[1.75rem] text-center"
        )}
      >
        {qty}
      </span>
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 text-lg font-semibold leading-none text-primary-foreground transition-colors hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
        aria-label="Increase quantity"
        onClick={increment}
      >
        <span aria-hidden className="-mt-0.5">
          +
        </span>
      </button>
    </div>
  );
}
