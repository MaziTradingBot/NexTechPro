"use server";

import { prisma } from "@/lib/db";
import type { PaymentMethod, PaymentStatus, Carrier } from "@prisma/client";

export interface CheckoutInput {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  carrier: "novaPoshta" | "meest";
  branch: string;
  paymentMethod: "card-prepay" | "cod" | "card-full";
  items: { productId: string; qty: number }[];
  customerEmail?: string;
}

export interface OrderResult {
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  prepaid: number;
  remaining: number;
  items: { productId: string; name: string; price: number; qty: number }[];
}

function newOrderNumber(): string {
  return `NTP-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function createOrder(input: CheckoutInput): Promise<OrderResult> {
  const ids = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  // Authoritative line items: prices come from the database, never the client.
  const lineItems = input.items
    .map((i) => {
      const p = byId.get(i.productId);
      if (!p) return null;
      return { productId: p.id, name: p.name, price: p.price, qty: Math.max(1, i.qty) };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  if (lineItems.length === 0) throw new Error("No valid items in the order.");

  const subtotal = lineItems.reduce((s, l) => s + l.price * l.qty, 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const method: PaymentMethod =
    input.paymentMethod === "card-prepay"
      ? "CARD_PREPAY"
      : input.paymentMethod === "card-full"
        ? "CARD_FULL"
        : "COD";
  const prepaid = method === "CARD_PREPAY" ? Math.round(total * 0.15) : method === "CARD_FULL" ? total : 0;
  const remaining = total - prepaid;
  const paymentStatus: PaymentStatus =
    method === "CARD_FULL" ? "PAID" : method === "CARD_PREPAY" ? "PARTIAL" : "PENDING";
  const carrier: Carrier = input.carrier === "meest" ? "MEEST" : "NOVA_POSHTA";
  const orderNumber = newOrderNumber();

  await prisma.order.create({
    data: {
      orderNumber,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      email: input.email || null,
      country: input.country,
      region: input.region,
      city: input.city,
      postalCode: input.postalCode,
      carrier,
      branch: input.branch,
      subtotal,
      deliveryFee,
      total,
      prepaid,
      remaining,
      paymentMethod: method,
      paymentStatus,
      fulfillmentStatus: "NEW",
      customerEmail: input.customerEmail || null,
      items: {
        create: lineItems.map((l) => ({
          productId: l.productId,
          name: l.name,
          price: l.price,
          qty: l.qty,
        })),
      },
    },
  });

  // Decrement stock (best effort).
  await Promise.all(
    lineItems.map((l) =>
      prisma.product
        .update({ where: { id: l.productId }, data: { stock: { decrement: l.qty } } })
        .catch(() => {}),
    ),
  );

  return { orderNumber, subtotal, deliveryFee, total, prepaid, remaining, items: lineItems };
}
