"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Gamepad2, Cpu, Headphones } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export function PromoBanner() {
  const { t } = useI18n();
  return (
    <section className="wrap py-16">
      <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div
          className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-brand-600/40 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-16 left-1/3 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl"
          aria-hidden
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-accent-400">
              <Gamepad2 size={14} /> −30%
            </span>
            <h2 className="mt-5 max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {t("promo.title")}
            </h2>
            <p className="mt-3 max-w-md text-slate-300">{t("promo.subtitle")}</p>
            <Link
              href="/catalog?category=gaming"
              className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-50"
            >
              {t("promo.cta")}
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative hidden justify-end gap-4 lg:flex">
            {[
              { Icon: Gamepad2, c: "#a855f7", d: 0 },
              { Icon: Cpu, c: "#06b6d4", d: 0.4 },
              { Icon: Headphones, c: "#f43f5e", d: 0.8 },
            ].map(({ Icon, c, d }, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: d }}
                className="grid h-28 w-28 place-items-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur"
                style={{ marginTop: i * 22 }}
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl text-white"
                  style={{ background: `linear-gradient(150deg, ${c}, ${c}bb)` }}
                >
                  <Icon size={26} />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
