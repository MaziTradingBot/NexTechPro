"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/products";
import { getCategoryIcon } from "@/components/CategoryIcon";
import { useI18n } from "@/lib/i18n/provider";
import { SectionHeading } from "@/components/ui/SectionHeading";

const taglineKey: Record<string, string> = {
  phones: "categories.taglinePhones",
  laptops: "categories.taglineLaptops",
  gaming: "categories.taglineGaming",
  audio: "categories.taglineAudio",
  tablets: "categories.taglineTablets",
  wearables: "categories.taglineWearables",
  accessories: "categories.taglineAccessories",
  monitors: "categories.taglineMonitors",
};

export function CategoryGrid() {
  const { t } = useI18n();
  return (
    <section className="wrap py-16">
      <SectionHeading title={t("categories.title")} subtitle={t("categories.subtitle")} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => {
          const Icon = getCategoryIcon(c.id);
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
            >
              <Link
                href={`/catalog?category=${c.id}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border)] bg-surface p-5 transition hover:shadow-lg"
              >
                <div
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 transition group-hover:scale-125"
                  style={{ background: c.accent }}
                  aria-hidden
                />
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl text-white"
                  style={{ background: `linear-gradient(150deg, ${c.accent}, ${c.accent}bb)` }}
                >
                  <Icon size={24} strokeWidth={1.6} />
                </span>
                <div className="mt-6">
                  <h3 className="flex items-center gap-1 font-semibold text-white">
                    {t(`categories.${c.id}`)}
                    <ArrowUpRight
                      size={16}
                      className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-500"
                    />
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">{t(taglineKey[c.id])}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
