import Link from "next/link";
import { ShoppingBag, Wallet, Truck, AlertTriangle, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { PaymentBadge, FulfillmentBadge } from "@/components/admin/Badges";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdmin();

  const [orderCount, revenueAgg, toShip, pendingPay, lowStock, recent] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count({ where: { fulfillmentStatus: { in: ["NEW", "PROCESSING"] } } }),
    prisma.order.count({ where: { paymentStatus: { in: ["PENDING", "PARTIAL"] } } }),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const revenue = revenueAgg._sum.total ?? 0;

  const stats = [
    { label: "Orders", value: String(orderCount), Icon: ShoppingBag, color: "#22d3ee" },
    { label: "Revenue", value: formatPrice(revenue, "en"), Icon: Wallet, color: "#10b981" },
    { label: "To ship", value: String(toShip), Icon: Truck, color: "#8b5cf6" },
    { label: "Low stock", value: String(lowStock), Icon: AlertTriangle, color: "#f43f5e" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Welcome back, {session.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-slate-400">Here&apos;s what&apos;s happening in your store.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">{label}</span>
              <span
                className="grid h-9 w-9 place-items-center rounded-lg"
                style={{ background: `${color}1f`, color }}
              >
                <Icon size={18} />
              </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-surface">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-bold text-white">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            No orders yet. They&apos;ll appear here as customers check out.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 font-semibold">Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map((o) => (
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
                    <td className="px-5 py-3 font-semibold text-white">{formatPrice(o.total, "en")}</td>
                    <td className="px-5 py-3">
                      <PaymentBadge status={o.paymentStatus} />
                    </td>
                    <td className="px-5 py-3">
                      <FulfillmentBadge status={o.fulfillmentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
