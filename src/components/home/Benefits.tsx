"use client";

import { motion } from "motion/react";
import { Truck, Wallet, ShieldCheck, Headphones } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

const items = [
  { key: "delivery", Icon: Truck, color: "#6366f1" },
  { key: "payment", Icon: Wallet, color: "#06b6d4" },
  { key: "warranty", Icon: ShieldCheck, color: "#10b981" },
  { key: "support", Icon: Headphones, color: "#f59e0b" },
] as const;

export function Benefits() {
  const { t } = useI18n();
  return (
    <section className="wrap -mt-10 relative z-10">
      <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {items.map(({ key, Icon, color }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-3.5"
          >
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{ background: `${color}1a`, color }}
            >
              <Icon size={22} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {t(`benefits.${key}.title`)}
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                {t(`benefits.${key}.desc`)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
