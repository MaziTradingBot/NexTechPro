"use client";

import Link from "next/link";
import { products } from "@/lib/data/products";
import { useI18n } from "@/lib/i18n/provider";

export function BrandMarquee() {
  const { t } = useI18n();
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <section id="brands" className="wrap scroll-mt-28 py-14">
      <h2 className="mb-7 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
        {t("brandsSection.title")}
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {brands.map((brand) => (
          <Link
            key={brand}
            href="/catalog"
            className="rounded-xl border border-white/10 bg-surface px-5 py-2.5 text-sm font-bold tracking-tight text-slate-300 transition hover:border-brand-500/40 hover:text-white"
          >
            {brand}
          </Link>
        ))}
      </div>
    </section>
  );
}
