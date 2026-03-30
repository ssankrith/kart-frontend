"use client";

import Link from "next/link";
import { useCart } from "@/contexts/cart-context";

export function SiteHeader() {
  const { totalCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-page/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Kart
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/menu"
            className="text-foreground-muted transition-colors hover:text-accent"
          >
            Menu
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-foreground-muted transition-colors hover:text-accent"
          >
            Cart
            {totalCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {totalCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
