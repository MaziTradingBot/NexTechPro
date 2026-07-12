"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Product, ProductTag } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "new", labelKey: "featured.tabNew", tag: "new" as ProductTag },
  { id: "hit", labelKey: "featured.tabPopular", tag: "hit" as ProductTag },
  { id: "sale", labelKey: "featured.tabDeals", tag: "sale" as ProductTag },
];

export function FeaturedProducts({ products }: { products: Product[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState(tabs[0].id);
  const tag = tabs.find((tb) => tb.id === active)!.tag;
  const list = products.filter((p) => p.tags.includes(tag)).slice(0, 8);

  return (
    <section className="wrap py-6">
      <SectionHeading title={t("featured.title")} subtitle={t("featured.subtitle")} href="/catalog" />

      <div className="mb-7 flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setActive(tb.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              active === tb.id
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-surface text-slate-300 border border-white/10 hover:border-brand-500/40 hover:text-brand-300",
            )}
          >
            {t(tb.labelKey)}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </motion.div>
    </section>
  );
}
