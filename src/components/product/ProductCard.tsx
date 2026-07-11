"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingCart, GitCompare, Check } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { discountPercent } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useCompareStore } from "@/lib/store/compare";
import { useToastStore } from "@/lib/store/toast";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";
import { TagPills } from "@/components/ui/TagPills";
import { Stars } from "@/components/ui/Stars";
import { Price } from "@/components/ui/Price";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  const add = useCartStore((s) => s.add);
  const inCompare = useCompareStore((s) => s.ids.includes(product.id));
  const toggleCompare = useCompareStore((s) => s.toggle);
  const pushToast = useToastStore((s) => s.push);
  const discount = discountPercent(product.price, product.oldPrice);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product.id);
    pushToast(`${product.name} · ${t("common.addedToCart")}`, "success");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    const nowIn = toggleCompare(product.id);
    pushToast(
      nowIn ? t("common.addedToCompare") : t("common.removedFromCompare"),
      "info",
    );
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white"
    >
      <Link href={`/product/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-square">
          <ProductImage product={product} className="h-full w-full" />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            <TagPills tags={product.tags} />
            {discount && (
              <span className="w-fit rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                −{discount}%
              </span>
            )}
          </div>

          <button
            onClick={handleCompare}
            aria-label={t("product.addCompare")}
            className={cn(
              "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border transition",
              inCompare
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-[var(--border)] bg-white/90 text-slate-500 hover:text-brand-600",
            )}
          >
            {inCompare ? <Check size={16} /> : <GitCompare size={16} />}
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-xs font-medium text-slate-400">{product.brand}</span>
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-brand-700">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Stars rating={product.rating} />
            <span className="font-medium text-slate-600">{product.rating}</span>
            <span>· {product.reviews}</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <Price value={product.price} oldValue={product.oldPrice} className="text-lg text-slate-900" />
            <button
              onClick={handleAdd}
              aria-label={t("common.addToCart")}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-sm transition hover:bg-brand-700 active:scale-95"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
