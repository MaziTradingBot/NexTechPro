"use client";

import Link from "next/link";
import { ArrowRight, Gamepad2, Headphones } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export function PromoBanner() {
  const { t } = useI18n();
  return (
    <section className="wrap py-8">
      <div className="grid gap-5 md:grid-cols-2">
        {/* Gaming */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(100% 120% at 85% 20%, rgba(168,85,247,0.55), transparent 60%), linear-gradient(140deg, #1a1030 0%, #0c0c16 70%)",
            }}
            aria-hidden
          />
          <Gamepad2
            size={150}
            className="absolute -bottom-6 -right-4 text-violet-500/20 transition group-hover:scale-110"
            aria-hidden
          />
          <div className="relative">
            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {t("promo.gamingTitle")}
            </h3>
            <p className="mt-2 text-slate-300">{t("promo.gamingDesc")}</p>
            <Link
              href="/catalog?category=gaming"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              {t("promo.gamingBtn")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Audio */}
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(100% 120% at 85% 20%, rgba(6,182,212,0.5), transparent 60%), linear-gradient(140deg, #06222b 0%, #0c0c16 70%)",
            }}
            aria-hidden
          />
          <Headphones
            size={150}
            className="absolute -bottom-6 -right-4 text-brand-500/20 transition group-hover:scale-110"
            aria-hidden
          />
          <div className="relative">
            <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {t("promo.audioTitle")}
            </h3>
            <p className="mt-2 text-slate-300">{t("promo.audioDesc")}</p>
            <Link
              href="/catalog?category=audio"
              className="mt-6 inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {t("promo.audioBtn")} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
