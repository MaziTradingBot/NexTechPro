import { cn } from "@/lib/utils";

const paymentStyles: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-300",
  PARTIAL: "bg-brand-500/15 text-brand-300",
  PAID: "bg-emerald-500/15 text-emerald-300",
  REFUNDED: "bg-slate-500/20 text-slate-300",
};

const paymentLabel: Record<string, string> = {
  PENDING: "Payment pending",
  PARTIAL: "Prepaid (15%)",
  PAID: "Paid",
  REFUNDED: "Refunded",
};

const fulfillStyles: Record<string, string> = {
  NEW: "bg-violet-500/15 text-violet-300",
  PROCESSING: "bg-amber-500/15 text-amber-300",
  SHIPPED: "bg-brand-500/15 text-brand-300",
  DELIVERED: "bg-emerald-500/15 text-emerald-300",
  CANCELLED: "bg-rose-500/15 text-rose-300",
};

const fulfillLabel: Record<string, string> = {
  NEW: "New",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";

export function PaymentBadge({ status }: { status: string }) {
  return <span className={cn(base, paymentStyles[status])}>{paymentLabel[status] ?? status}</span>;
}

export function FulfillmentBadge({ status }: { status: string }) {
  return <span className={cn(base, fulfillStyles[status])}>{fulfillLabel[status] ?? status}</span>;
}

export const methodLabel: Record<string, string> = {
  CARD_PREPAY: "Card · 15% prepay",
  COD: "Cash on delivery",
  CARD_FULL: "Card · full",
};

export const carrierLabel: Record<string, string> = {
  NOVA_POSHTA: "Nova Poshta",
  MEEST: "Meest",
};
