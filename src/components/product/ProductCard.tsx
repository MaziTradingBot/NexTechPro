"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingCart, GitCompare, Check, Heart } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { discountPercent } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useCompareStore } from "@/lib/store/compare";
import { useWishlistStore } from "@/lib/store/wishlist";
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
  const inWishlist = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const pushToast = useToastStore((s) => s.push);
  const discount = discountPercent(product.price, product.oldPrice);
  const stock = product.stock ?? 20;
  const out = stock <= 0;
  const low = stock > 0 && stock <= 5;
  const barPct = out ? 0 : Math.min(100, Math.max(8, stock * 3));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product.id);
    pushToast(`${product.name} · ${t("common.addedToCart")}`, "success");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    const nowIn = toggleCompare(product.id);
    pushToast(nowIn ? t("common.addedToCompare") : t("common.removedFromCompare"), "info");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const nowIn = toggleWishlist(product.id);
    pushToast(nowIn ? t("common.addedToWishlist") : t("common.removedFromWishlist"), "info");
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-brand-500/40"
    >
      <Link href={`/product/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-square">
          <ProductImage product={product} className="h-full w-full" />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discount ? (
              <span className="w-fit rounded-full bg-deal-500 px-2.5 py-1 text-[11px] font-bold text-white">
                {discount}% OFF
              </span>
            ) : null}
            <TagPills tags={product.tags} />
          </div>

          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <button
              onClick={handleWishlist}
              aria-label={t("account.wishlist")}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition",
                inWishlist
                  ? "border-rose-500 bg-rose-500 text-white"
                  : "border-white/15 bg-black/40 text-slate-300 hover:text-rose-400",
              )}
            >
              <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleCompare}
              aria-label={t("product.addCompare")}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition",
                inCompare
                  ? "border-brand-500 bg-brand-600 text-white"
                  : "border-white/15 bg-black/40 text-slate-300 hover:text-brand-400",
              )}
            >
              {inCompare ? <Check size={16} /> : <GitCompare size={16} />}
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <span
            className="text-[11px] font-bold uppercase tracking-wider"
            style={{ color: product.accent }}
          >
            {t(`categories.${product.category}`)}
          </span>
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white group-hover:text-brand-300">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Stars rating={product.rating} />
            <span>({product.reviews.toLocaleString()})</span>
          </div>

          <div className="pt-1">
            <Price value={product.price} oldValue={product.oldPrice} className="text-xl" />
          </div>

          {/* stock bar */}
          <div className="mt-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={cn("h-full rounded-full", out || low ? "bg-rose-500" : "bg-brand-500")}
                style={{ width: `${barPct}%` }}
              />
            </div>
            <p
              className={cn(
                "mt-1.5 text-[11px] font-medium",
                out || low ? "text-rose-400" : "text-slate-400",
              )}
            >
              {out ? t("common.outOfStock") : `${stock} ${t("common.leftInStock")}`}
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="mt-auto flex h-10 items-center justify-center gap-2 rounded-xl brand-gradient text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(34,211,238,0.6)] transition hover:opacity-90 active:scale-[0.98]"
          >
            <ShoppingCart size={16} /> {t("common.addToCart")}
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
