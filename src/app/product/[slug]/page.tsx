"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { motion } from "motion/react";
import {
  ShoppingCart,
  GitCompare,
  Check,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Zap,
} from "lucide-react";
import { getProduct, getRelated } from "@/lib/data/products";
import { discountPercent } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useCompareStore } from "@/lib/store/compare";
import { useToastStore } from "@/lib/store/toast";
import { useI18n } from "@/lib/i18n/provider";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductCard } from "@/components/product/ProductCard";
import { TagPills } from "@/components/ui/TagPills";
import { Stars } from "@/components/ui/Stars";
import { Price } from "@/components/ui/Price";
import { cn } from "@/lib/utils";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = getProduct(params.slug);
  if (!product) notFound();

  const { t } = useI18n();
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const inCompare = useCompareStore((s) => s.ids.includes(product!.id));
  const toggleCompare = useCompareStore((s) => s.toggle);
  const pushToast = useToastStore((s) => s.push);

  const [qty, setQty] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);

  const p = product!;
  const discount = discountPercent(p.price, p.oldPrice);
  const related = getRelated(p);

  const handleAdd = () => {
    add(p.id, qty);
    pushToast(`${p.name} · ${t("common.addedToCart")}`, "success");
  };

  const handleBuyNow = () => {
    add(p.id, qty);
    router.push("/checkout");
  };

  return (
    <div className="wrap py-8">
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
        <Link href="/" className="hover:text-slate-200">
          {t("common.home")}
        </Link>
        <ChevronRight size={14} />
        <Link href={`/catalog?category=${p.category}`} className="hover:text-slate-200">
          {t(`categories.${p.category}`)}
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-slate-200">{p.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* gallery */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-surface">
            <ProductImage product={p} className="aspect-square w-full" iconClassName="h-1/3 w-1/3" />
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <TagPills tags={p.tags} />
              {discount && (
                <span className="w-fit rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white">
                  −{discount}%
                </span>
              )}
            </div>
          </div>
          {p.colors && p.colors.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-medium text-slate-400">{t("common.color")}:</span>
              <div className="flex gap-2">
                {p.colors.map((c, i) => (
                  <button
                    key={c}
                    onClick={() => setColorIndex(i)}
                    aria-label={c}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition",
                      colorIndex === i ? "border-brand-600 ring-2 ring-brand-500/30" : "border-white shadow",
                    )}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* info */}
        <div>
          <span className="text-sm font-medium text-slate-400">{p.brand}</span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">{p.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <Stars rating={p.rating} size={16} />
            <span className="font-semibold text-slate-200">{p.rating}</span>
            <span className="text-slate-400">
              · {p.reviews} {t("common.reviews")}
            </span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <Price value={p.price} oldValue={p.oldPrice} className="text-3xl text-white" oldClassName="text-base" />
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              <Check size={13} /> {t("common.inStock")}
            </span>
          </div>

          {/* highlights */}
          <ul className="mt-6 space-y-2">
            {p.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-500/10 text-brand-400">
                  <Check size={13} />
                </span>
                {h}
              </li>
            ))}
          </ul>

          {/* qty + actions */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-[var(--border)] bg-surface">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-12 w-12 place-items-center text-slate-400 hover:text-white"
                aria-label="-"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-12 w-12 place-items-center text-slate-400 hover:text-white"
                aria-label="+"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98] sm:flex-none"
            >
              <ShoppingCart size={18} /> {t("common.addToCart")}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98] sm:flex-none"
            >
              <Zap size={18} /> {t("common.buyNow")}
            </button>
          </div>

          <button
            onClick={() => {
              const nowIn = toggleCompare(p.id);
              pushToast(nowIn ? t("common.addedToCompare") : t("common.removedFromCompare"), "info");
            }}
            className={cn(
              "mt-3 inline-flex items-center gap-2 text-sm font-medium transition",
              inCompare ? "text-brand-300" : "text-slate-400 hover:text-brand-300",
            )}
          >
            {inCompare ? <Check size={16} /> : <GitCompare size={16} />}
            {inCompare ? t("product.inCompare") : t("product.addCompare")}
          </button>

          {/* trust badges */}
          <div className="mt-7 grid gap-3 rounded-2xl border border-[var(--border)] bg-surface p-4 sm:grid-cols-3">
            <Badge icon={<Truck size={18} />} text={t("product.delivery")} />
            <Badge icon={<ShieldCheck size={18} />} text={t("product.warranty")} />
            <Badge icon={<CreditCard size={18} />} text={t("product.securePay")} />
          </div>
        </div>
      </div>

      {/* specifications */}
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold text-white">{t("common.specifications")}</h2>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <tbody>
                {p.specs.map((s, i) => (
                  <tr key={s.key} className={i % 2 ? "bg-surface" : "bg-white/[0.03]"}>
                    <td className="w-1/2 px-4 py-3 text-slate-400">{t(`spec.${s.key}`)}</td>
                    <td className="px-4 py-3 font-medium text-slate-100">{s.value}</td>
                  </tr>
                ))}
                <tr className="bg-white/[0.03]">
                  <td className="px-4 py-3 text-slate-400">{t("spec.warranty")}</td>
                  <td className="px-4 py-3 font-medium text-slate-100">24 {t("common.months")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-white">{t("common.description")}</h2>
          <div className="rounded-2xl border border-[var(--border)] bg-surface p-5 text-sm leading-relaxed text-slate-300">
            <p>
              <span className="font-semibold text-white">{p.name}</span> — {p.brand}.
            </p>
            <ul className="mt-3 space-y-1.5">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-brand-500">•</span> {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-white">{t("common.relatedProducts")}</h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-slate-300">
      <span className="text-brand-400">{icon}</span>
      <span className="leading-tight">{text}</span>
    </div>
  );
}
