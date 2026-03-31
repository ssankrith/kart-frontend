"use client";

import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function AddToCartButton({
  product,
  label = "Add to cart",
  className,
}: {
  product: Product;
  label?: string;
  className?: string;
}) {
  const { addItem } = useCart();

  return (
    <Button
      type="button"
      className={cn("w-full sm:w-auto", className)}
      onClick={() => addItem(product, 1)}
    >
      {label}
    </Button>
  );
}
