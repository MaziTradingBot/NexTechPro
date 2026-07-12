import Link from "next/link";
import { notFound } from "next/navigation";
import { User, Phone, Mail, MapPin, Truck, CreditCard, Package } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin, can } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import {
  PaymentBadge,
  FulfillmentBadge,
  methodLabel,
  carrierLabel,
} from "@/components/admin/Badges";
import { updatePayment, updateFulfillment } from "../actions";

export const dynamic = "force-dynamic";

const field =
  "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/orders" className="text-sm text-slate-400 hover:text-white">
          ← Back to orders
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-extrabold text-white">{order.orderNumber}</h1>
          <PaymentBadge status={order.paymentStatus} />
          <FulfillmentBadge status={order.fulfillmentStatus} />
          <span className="text-sm text-slate-500">
            {new Date(order.createdAt).toLocaleString("en-GB")}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* items + summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-surface">
            <h2 className="flex items-center gap-2 border-b border-white/10 px-5 py-4 font-bold text-white">
              <Package size={18} /> Items
            </h2>
            <div className="divide-y divide-white/5">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-slate-200">
                    {it.name} <span className="text-slate-500">× {it.qty}</span>
                  </span>
                  <span className="font-semibold text-white">
                    {formatPrice(it.price * it.qty, "en")}
                  </span>
                </div>
              ))}
            </div>
            <dl className="space-y-2 border-t border-white/10 px-5 py-4 text-sm">
              <Row label="Subtotal" value={formatPrice(order.subtotal, "en")} />
              <Row
                label="Delivery"
                value={order.deliveryFee ? formatPrice(order.deliveryFee, "en") : "Free"}
              />
              <div className="flex justify-between border-t border-white/10 pt-2 text-base font-bold text-white">
                <dt>Total</dt>
                <dd>{formatPrice(order.total, "en")}</dd>
              </div>
              {order.paymentMethod === "CARD_PREPAY" && (
                <div className="mt-2 space-y-1 rounded-xl bg-brand-500/10 p-3 text-xs">
                  <Row label="Prepaid (15%)" value={formatPrice(order.prepaid, "en")} />
                  <Row label="Balance on delivery" value={formatPrice(order.remaining, "en")} />
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* right column */}
        <div className="space-y-6">
          {/* customer */}
          <div className="rounded-2xl border border-white/10 bg-surface p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold text-white">
              <User size={17} /> Customer
            </h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                {order.firstName} {order.lastName}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-slate-500" /> {order.phone}
              </p>
              {order.email && (
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-500" /> {order.email}
                </p>
              )}
              <p className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-slate-500" />
                <span>
                  {order.city}, {order.region}, {order.postalCode}, {order.country}
                  <br />
                  {carrierLabel[order.carrier]} · {order.branch}
                </span>
              </p>
            </div>
          </div>

          {/* payment panel */}
          <div className="rounded-2xl border border-white/10 bg-surface p-5">
            <h2 className="mb-1 flex items-center gap-2 font-bold text-white">
              <CreditCard size={17} /> Payment
            </h2>
            <p className="mb-3 text-xs text-slate-500">{methodLabel[order.paymentMethod]}</p>
            {can.managePayments(session.role) ? (
              <form action={updatePayment} className="space-y-3">
                <input type="hidden" name="id" value={order.id} />
                <select name="paymentStatus" defaultValue={order.paymentStatus} className={field}>
                  <option value="PENDING">Payment pending</option>
                  <option value="PARTIAL">Prepaid (15%)</option>
                  <option value="PAID">Paid in full</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
                <button className="w-full rounded-xl brand-gradient py-2.5 text-sm font-semibold text-white">
                  Update payment
                </button>
              </form>
            ) : (
              <p className="text-sm text-slate-400">
                Current: <PaymentBadge status={order.paymentStatus} />
                <span className="mt-2 block text-xs text-slate-500">
                  Only payment or general admins can change this.
                </span>
              </p>
            )}
          </div>

          {/* delivery panel */}
          <div className="rounded-2xl border border-white/10 bg-surface p-5">
            <h2 className="mb-3 flex items-center gap-2 font-bold text-white">
              <Truck size={17} /> Delivery
            </h2>
            {can.manageDelivery(session.role) ? (
              <form action={updateFulfillment} className="space-y-3">
                <input type="hidden" name="id" value={order.id} />
                <select
                  name="fulfillmentStatus"
                  defaultValue={order.fulfillmentStatus}
                  className={field}
                >
                  <option value="NEW">New</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <input
                  name="trackingNumber"
                  defaultValue={order.trackingNumber ?? ""}
                  placeholder="Tracking number"
                  className={field}
                />
                <button className="w-full rounded-xl brand-gradient py-2.5 text-sm font-semibold text-white">
                  Update delivery
                </button>
              </form>
            ) : (
              <p className="text-sm text-slate-400">
                Current: <FulfillmentBadge status={order.fulfillmentStatus} />
                {order.trackingNumber && (
                  <span className="mt-1 block text-xs text-slate-500">
                    Tracking: {order.trackingNumber}
                  </span>
                )}
                <span className="mt-2 block text-xs text-slate-500">
                  Only delivery or general admins can change this.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-semibold text-slate-200">{value}</dd>
    </div>
  );
}
