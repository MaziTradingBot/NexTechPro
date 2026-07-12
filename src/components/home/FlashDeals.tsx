"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Zap, ArrowRight } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { useI18n } from "@/lib/i18n/provider";
import { useMounted } from "@/lib/useMounted";

function useCountdown() {
  // Counts down to the next local midnight.
  const [remaining, setRemaining] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      let diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
      const h = Math.floor(diff / 3600);
      diff %= 3600;
      const m = Math.floor(diff / 60);
      const s = diff % 60;
      setRemaining({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return remaining;
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="grid min-w-11 place-items-center rounded-lg bg-surface2 px-2 py-1.5 font-mono text-xl font-bold text-white ring-1 ring-white/10">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
}

export function FlashDeals({ deals }: { deals: Product[] }) {
  const { t } = useI18n();
  const mounted = useMounted();
  const { h, m, s } = useCountdown();

  return (
    <section className="wrap py-14">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-5">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            <Zap size={26} className="text-rose-500" fill="currentColor" />
            <span className="deal-gradient">{t("flash.title")}</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">{t("flash.endsIn")}</span>
            <div className="flex items-center gap-1.5">
              <TimeBox value={mounted ? h : 0} label={t("flash.hrs")} />
              <span className="pb-4 text-lg font-bold text-slate-600">:</span>
              <TimeBox value={mounted ? m : 0} label={t("flash.min")} />
              <span className="pb-4 text-lg font-bold text-slate-600">:</span>
              <TimeBox value={mounted ? s : 0} label={t("flash.sec")} />
            </div>
          </div>
        </div>
        <Link
          href="/catalog?tag=sale"
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200"
        >
          {t("common.viewAll")} <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {deals.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
