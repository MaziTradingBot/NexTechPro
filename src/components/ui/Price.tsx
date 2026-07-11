"use client";

import { useI18n } from "@/lib/i18n/provider";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  value,
  oldValue,
  className,
  oldClassName,
}: {
  value: number;
  oldValue?: number;
  className?: string;
  oldClassName?: string;
}) {
  const { locale } = useI18n();
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={cn("font-bold tracking-tight text-brand-400", className)}>
        {formatPrice(value, locale)}
      </span>
      {oldValue && oldValue > value && (
        <span className={cn("text-sm text-slate-500 line-through", oldClassName)}>
          {formatPrice(oldValue, locale)}
        </span>
      )}
    </span>
  );
}
