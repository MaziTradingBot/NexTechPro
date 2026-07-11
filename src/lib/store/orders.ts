"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PaymentMethod = "card-prepay" | "cod" | "card-full";

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  userKey: string;
  createdAt: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: PaymentMethod;
  prepaid: number;
  remaining: number;
  contact: { firstName: string; lastName: string; phone: string; email: string };
  delivery: {
    country: string;
    region: string;
    city: string;
    postalCode: string;
    carrier: "novaPoshta" | "meest";
    branch: string;
  };
}

interface OrdersState {
  orders: Order[];
  add: (order: Order) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (order) => set({ orders: [order, ...get().orders] }),
    }),
    { name: "nextech-orders" },
  ),
);

export function generateOrderId(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `NTP-${n}`;
}
