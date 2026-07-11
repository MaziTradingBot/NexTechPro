"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export function SectionHeading({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 text-sm text-slate-400 sm:text-base">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200 sm:flex"
        >
          {t("common.viewAll")}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
