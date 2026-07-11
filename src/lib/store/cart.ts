"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  qty: number;
}

interface CartState {
  activeUser: string; // "guest" or a user id
  carts: Record<string, CartItem[]>;
  hasHydrated: boolean;
  setActiveUser: (key: string) => void;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
}

/**
 * Cart is keyed per user (`carts[activeUser]`), so two different accounts —
 * or an account vs. a guest — never see each other's items. When a user logs
 * in/out we call `setActiveUser`, and the correct cart is shown instantly.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      activeUser: "guest",
      carts: {},
      hasHydrated: false,
      setActiveUser: (key) => set({ activeUser: key }),
      add: (productId, qty = 1) => {
        const { activeUser, carts } = get();
        const current = carts[activeUser] ?? [];
        const existing = current.find((i) => i.productId === productId);
        const next = existing
          ? current.map((i) =>
              i.productId === productId ? { ...i, qty: i.qty + qty } : i,
            )
          : [...current, { productId, qty }];
        set({ carts: { ...carts, [activeUser]: next } });
      },
      remove: (productId) => {
        const { activeUser, carts } = get();
        const current = carts[activeUser] ?? [];
        set({
          carts: {
            ...carts,
            [activeUser]: current.filter((i) => i.productId !== productId),
          },
        });
      },
      setQty: (productId, qty) => {
        const { activeUser, carts } = get();
        const current = carts[activeUser] ?? [];
        const next =
          qty <= 0
            ? current.filter((i) => i.productId !== productId)
            : current.map((i) => (i.productId === productId ? { ...i, qty } : i));
        set({ carts: { ...carts, [activeUser]: next } });
      },
      clear: () => {
        const { activeUser, carts } = get();
        set({ carts: { ...carts, [activeUser]: [] } });
      },
    }),
    {
      name: "nextech-cart",
      partialize: (s) => ({ carts: s.carts, activeUser: s.activeUser }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);

// Stable empty reference so the selector never returns a new array (which would
// break useSyncExternalStore's snapshot caching and cause an infinite loop).
const EMPTY_ITEMS: CartItem[] = [];

// Reactive selector for the current user's items.
export function useCartItems(): CartItem[] {
  return useCartStore((s) => s.carts[s.activeUser] ?? EMPTY_ITEMS);
}
