"use client";

import { useI18n } from "@/lib/i18n/provider";
import type { ProductTag } from "@/lib/data/products";
import { cn } from "@/lib/utils";

const styles: Record<ProductTag, string> = {
  new: "bg-brand-600 text-white",
  hit: "bg-amber-400 text-slate-900",
  sale: "bg-rose-500 text-white",
};

const labelKey: Record<ProductTag, string> = {
  new: "common.tagNew",
  hit: "common.tagHit",
  sale: "common.tagSale",
};

export function TagPills({ tags, className }: { tags: ProductTag[]; className?: string }) {
  const { t } = useI18n();
  if (!tags.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
            styles[tag],
          )}
        >
          {t(labelKey[tag])}
        </span>
      ))}
    </div>
  );
}
