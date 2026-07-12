import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PaymentBadge, FulfillmentBadge } from "@/components/admin/Badges";

export const dynamic = "force-dynamic";

const filters = [
  { key: "all", label: "All" },
  { key: "payment", label: "Payment due" },
  { key: "to-ship", label: "To ship" },
  { key: "delivered", label: "Delivered" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  await requireAdmin();
  const { filter = "all" } = await searchParams;

  const where: Prisma.OrderWhereInput =
    filter === "payment"
      ? { paymentStatus: { in: ["PENDING", "PARTIAL"] } }
      : filter === "to-ship"
        ? { fulfillmentStatus: { in: ["NEW", "PROCESSING"] } }
        : filter === "delivered"
          ? { fulfillmentStatus: "DELIVERED" }
          : {};

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-white">Orders</h1>
      <p className="mt-1 text-sm text-slate-400">Manage payments and delivery.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={`/admin/orders?filter=${f.key}`}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition",
              filter === f.key
                ? "bg-brand-500/20 text-brand-300"
                : "border border-white/10 text-slate-400 hover:text-white",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-surface">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Items</th>
              <th className="px-5 py-3 font-semibold">Total</th>
              <th className="px-5 py-3 font-semibold">Payment</th>
              <th className="px-5 py-3 font-semibold">Delivery</th>
              <th className="px-5 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/[0.03]">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-mono font-semibold text-brand-300 hover:text-brand-200"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-200">
                    {o.firstName} {o.lastName}
                  </td>
                  <td className="px-5 py-3 text-slate-400">{o._count.items}</td>
                  <td className="px-5 py-3 font-semibold text-white">{formatPrice(o.total, "en")}</td>
                  <td className="px-5 py-3">
                    <PaymentBadge status={o.paymentStatus} />
                  </td>
                  <td className="px-5 py-3">
                    <FulfillmentBadge status={o.fulfillmentStatus} />
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
