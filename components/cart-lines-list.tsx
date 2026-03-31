"use client";

import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { ResponsiveProductImage } from "@/components/responsive-product-image";
import { cn } from "@/lib/cn";

type Variant = "full" | "compact";

export function CartLinesList({ variant = "full" }: { variant?: Variant }) {
  const { lines, setQuantity, removeLine } = useCart();
  const compact = variant === "compact";

  if (lines.length === 0) return null;

  return (
    <ul className={cn("space-y-3", compact && "space-y-2")}>
      {lines.map((line) => (
        <li
          key={line.productId}
          className={cn(
            "flex gap-3 rounded-xl border border-border bg-surface",
            compact ? "p-2.5" : "p-4"
          )}
        >
          <div
            className={cn(
              "relative shrink-0 overflow-hidden rounded-lg bg-surface-muted",
              compact ? "h-14 w-14" : "h-24 w-24"
            )}
          >
            {line.product.image ? (
              <ResponsiveProductImage
                image={line.product.image}
                alt={line.product.name}
                sizes={compact ? "56px" : "96px"}
              />
            ) : null}
            <span
              className={cn(
                "absolute right-1 top-1 flex min-w-[1.25rem] items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-sm",
                compact ? "px-1 text-[10px] leading-none" : "px-1.5 py-0.5 text-xs"
              )}
              aria-label={`Quantity ${line.quantity}`}
            >
              {line.quantity}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <Link
                href={`/menu/${line.productId}`}
                className={cn(
                  "font-medium text-foreground hover:text-accent",
                  compact ? "line-clamp-2 text-sm" : ""
                )}
              >
                {line.product.name}
              </Link>
              <span
                className={cn(
                  "shrink-0 font-semibold text-accent",
                  compact ? "text-xs" : "text-sm"
                )}
              >
                ×{line.quantity}
              </span>
            </div>
            <p
              className={cn(
                "text-muted",
                compact ? "text-xs" : "mt-1 text-sm"
              )}
            >
              ${line.product.price.toFixed(2)} each
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-foreground-muted">
                Qty
                <select
                  className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-foreground"
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
                className="text-xs text-accent hover:underline"
                onClick={() => removeLine(line.productId)}
              >
                Remove
              </button>
            </div>
          </div>
          <p
            className={cn(
              "shrink-0 font-semibold text-foreground",
              compact ? "text-xs" : "text-sm"
            )}
          >
            ${(line.product.price * line.quantity).toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  );
}
