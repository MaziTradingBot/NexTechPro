"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, Package, ArrowRight, Truck } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useOrdersStore } from "@/lib/store/orders";
import { formatPrice } from "@/lib/format";

function SuccessContent() {
  const { t, locale } = useI18n();
  const params = useSearchParams();
  const orderId = params.get("order") ?? "NTP-000000";
  const order = useOrdersStore((s) => s.orders.find((o) => o.id === orderId));

  return (
    <div className="wrap py-16">
      <div className="mx-auto max-w-lg text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600"
        >
          <CheckCircle2 size={44} />
        </motion.span>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
          {t("success.title")}
        </h1>
        <p className="mt-3 text-slate-500">{t("success.subtitle")}</p>

        <div className="mt-8 rounded-2xl border border-[var(--border)] bg-white p-6 text-left">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Package size={16} /> {t("success.orderNumber")}
            </div>
            <span className="font-mono text-lg font-bold text-brand-700">{orderId}</span>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Truck size={16} /> {t("success.estDelivery")}
            </div>
            <span className="font-semibold text-slate-900">{t("success.days")}</span>
          </div>

          {order && (
            <div className="space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              {order.items.map((it) => (
                <div key={it.productId} className="flex justify-between text-slate-600">
                  <span className="line-clamp-1">
                    {it.name} × {it.qty}
                  </span>
                  <span className="font-medium text-slate-900">
                    {formatPrice(it.price * it.qty, locale)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t border-[var(--border)] pt-2 font-semibold">
                <span>{t("cart.total")}</span>
                <span>{formatPrice(order.total, locale)}</span>
              </div>
              {order.payment === "card-prepay" && (
                <div className="mt-2 rounded-lg bg-brand-50 p-2.5 text-xs text-brand-800">
                  {t("checkout.payNow")}: <b>{formatPrice(order.prepaid, locale)}</b> ·{" "}
                  {t("checkout.remaining")}: <b>{formatPrice(order.remaining, locale)}</b>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t("success.keepShopping")} <ArrowRight size={16} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t("success.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="wrap py-20 text-center text-slate-400">…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
