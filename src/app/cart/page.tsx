"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCartItems, useCartStore } from "@/lib/store/cart";
import { getProductById } from "@/lib/data/products";
import { useI18n } from "@/lib/i18n/provider";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/utils";
import { ProductImage } from "@/components/product/ProductImage";
import { Price } from "@/components/ui/Price";

export default function CartPage() {
  const { t, locale } = useI18n();
  const mounted = useMounted();
  const items = useCartItems();
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const lines = items
    .map((i) => ({ item: i, product: getProductById(i.productId) }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((sum, l) => sum + l.product!.price * l.item.qty, 0);
  const count = items.reduce((n, i) => n + i.qty, 0);

  if (!mounted) {
    return <div className="wrap py-20 text-center text-slate-400">{t("common.loading")}</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="wrap py-20">
        <div className="mx-auto max-w-md rounded-3xl border border-[var(--border)] bg-white p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <ShoppingBag size={30} />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">{t("cart.empty")}</h1>
          <p className="mt-2 text-slate-500">{t("cart.emptyDesc")}</p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t("cart.startShopping")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("cart.title")}</h1>
      <p className="mt-1 text-sm text-slate-500">
        {count} {count === 1 ? t("cart.item") : t("cart.items")}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* items */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {lines.map(({ item, product }) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-4 rounded-2xl border border-[var(--border)] bg-white p-3 sm:p-4"
              >
                <Link
                  href={`/product/${product!.slug}`}
                  className="shrink-0 overflow-hidden rounded-xl border border-[var(--border)]"
                >
                  <ProductImage product={product!} className="h-24 w-24 sm:h-28 sm:w-28" iconClassName="h-1/2 w-1/2" />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-400">{product!.brand}</span>
                      <Link
                        href={`/product/${product!.slug}`}
                        className="block font-semibold leading-snug text-slate-900 hover:text-brand-700"
                      >
                        {product!.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => remove(item.productId)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      aria-label={t("common.remove")}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="flex items-center rounded-lg border border-[var(--border)]">
                      <button
                        onClick={() => setQty(item.productId, item.qty - 1)}
                        className="grid h-9 w-9 place-items-center text-slate-500 hover:text-slate-900"
                        aria-label="-"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.productId, item.qty + 1)}
                        className="grid h-9 w-9 place-items-center text-slate-500 hover:text-slate-900"
                        aria-label="+"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(product!.price * item.qty, locale)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-between pt-2">
            <Link href="/catalog" className="text-sm font-medium text-brand-700 hover:text-brand-800">
              ← {t("cart.continueShopping")}
            </Link>
            <button onClick={clear} className="text-sm font-medium text-slate-400 hover:text-rose-500">
              {t("cart.clear")}
            </button>
          </div>
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">{t("cart.orderSummary")}</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">{t("cart.subtotal")}</dt>
                <dd className="font-semibold text-slate-900">{formatPrice(subtotal, locale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">{t("cart.delivery")}</dt>
                <dd className="font-semibold text-emerald-600">{t("common.free")}</dd>
              </div>
              <div className="border-t border-[var(--border)] pt-3">
                <div className="flex items-baseline justify-between">
                  <dt className="font-semibold text-slate-900">{t("cart.total")}</dt>
                  <dd>
                    <Price value={subtotal} className="text-xl text-slate-900" />
                  </dd>
                </div>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white transition hover:bg-brand-700"
            >
              {t("cart.checkout")} <ArrowRight size={18} />
            </Link>

            <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-xs text-brand-800">
              <ShieldCheck size={15} className="mt-0.5 shrink-0" />
              {t("cart.prepaymentNote")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
