"use client";

import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  product,
  label = "Add to cart",
}: {
  product: Product;
  label?: string;
}) {
  const { addItem } = useCart();

  return (
    <Button
      type="button"
      className="w-full sm:w-auto"
      onClick={() => addItem(product, 1)}
    >
      {label}
    </Button>
  );
}
