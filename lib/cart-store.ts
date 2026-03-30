import type { CartLine, Product } from "@/lib/types";

/** Keep in sync with cart-context STORAGE_KEY */
export const CART_STORAGE_KEY = "kart-cart-v1";

function parseStored(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l) =>
        l &&
        typeof l.productId === "string" &&
        typeof l.quantity === "number" &&
        l.product &&
        typeof l.product.id === "string"
    );
  } catch {
    return [];
  }
}

let snapshot: CartLine[] = [];
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  snapshot = parseStored();
}

function emit() {
  listeners.forEach((l) => l());
}

function persist(lines: CartLine[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* ignore quota */
  }
}

export function getCartSnapshot(): CartLine[] {
  return snapshot;
}

export function subscribeCart(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  listeners.add(onStoreChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY || e.key === null) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Stable empty reference — useSyncExternalStore requires getServerSnapshot to be cached. */
const serverCartSnapshot: CartLine[] = [];

export function getServerCartSnapshot(): CartLine[] {
  return serverCartSnapshot;
}

export function addLine(product: Product, qty = 1) {
  const prev = snapshot;
  const i = prev.findIndex((l) => l.productId === product.id);
  let next: CartLine[];
  if (i === -1) {
    next = [...prev, { productId: product.id, quantity: qty, product }];
  } else {
    next = [...prev];
    next[i] = {
      ...next[i],
      quantity: next[i].quantity + qty,
      product,
    };
  }
  snapshot = next;
  persist(next);
  emit();
}

export function setLineQuantity(productId: string, quantity: number) {
  if (quantity < 1) {
    removeLine(productId);
    return;
  }
  snapshot = snapshot.map((l) =>
    l.productId === productId ? { ...l, quantity } : l
  );
  persist(snapshot);
  emit();
}

export function removeLine(productId: string) {
  snapshot = snapshot.filter((l) => l.productId !== productId);
  persist(snapshot);
  emit();
}

export function clearCart() {
  snapshot = [];
  persist(snapshot);
  emit();
}
