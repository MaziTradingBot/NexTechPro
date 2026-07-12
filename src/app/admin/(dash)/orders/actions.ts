"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { PaymentStatus, FulfillmentStatus } from "@prisma/client";

const PAYMENT_STATUSES = ["PENDING", "PARTIAL", "PAID", "REFUNDED"];
const FULFILLMENT_STATUSES = ["NEW", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function revalidateOrder(id: string) {
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updatePayment(formData: FormData): Promise<void> {
  await requireAdmin(["GENERAL", "PAYMENT"]);
  const id = String(formData.get("id"));
  const status = String(formData.get("paymentStatus"));
  if (!PAYMENT_STATUSES.includes(status)) return;
  await prisma.order.update({
    where: { id },
    data: { paymentStatus: status as PaymentStatus },
  });
  revalidateOrder(id);
}

export async function updateFulfillment(formData: FormData): Promise<void> {
  await requireAdmin(["GENERAL", "DELIVERY"]);
  const id = String(formData.get("id"));
  const status = String(formData.get("fulfillmentStatus"));
  if (!FULFILLMENT_STATUSES.includes(status)) return;
  const trackingNumber = String(formData.get("trackingNumber") || "").trim() || null;
  await prisma.order.update({
    where: { id },
    data: { fulfillmentStatus: status as FulfillmentStatus, trackingNumber },
  });
  revalidateOrder(id);
}
