"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const options: { code: Locale; label: string; short: string }[] = [
  { code: "uk", label: "Українська", short: "UA" },
  { code: "en", label: "English", short: "EN" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = options.find((o) => o.code === locale) ?? options[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition hover:bg-black/5",
          compact ? "text-slate-700" : "text-inherit",
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={16} />
        <span>{current.short}</span>
        <ChevronDown size={14} className={cn("transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-[var(--border)] bg-white p-1 shadow-xl">
          {options.map((o) => (
            <button
              key={o.code}
              onClick={() => {
                setLocale(o.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50",
                o.code === locale && "font-semibold text-brand-700",
              )}
            >
              <span>{o.label}</span>
              {o.code === locale && <Check size={15} className="text-brand-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
