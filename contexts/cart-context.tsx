"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartLine, Product } from "@/lib/types";
import {
  addLine,
  clearCart,
  getCartSnapshot,
  getServerCartSnapshot,
  removeLine as removeLineStore,
  setLineQuantity,
  subscribeCart,
} from "@/lib/cart-store";

type CartContextValue = {
  lines: CartLine[];
  totalCount: number;
  addItem: (product: Product, qty?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  const addItem = useCallback((product: Product, qty = 1) => {
    addLine(product, qty);
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLineQuantity(productId, quantity);
  }, []);

  const removeLine = useCallback((productId: string) => {
    removeLineStore(productId);
  }, []);

  const clear = useCallback(() => {
    clearCart();
  }, []);

  const totalCount = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      totalCount,
      addItem,
      setQuantity,
      removeLine,
      clear,
    }),
    [lines, totalCount, addItem, setQuantity, removeLine, clear]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
