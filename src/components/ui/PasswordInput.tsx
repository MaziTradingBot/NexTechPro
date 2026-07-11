"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-600">{label}</label>
      <div className="relative">
        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "h-12 w-full rounded-xl border bg-white pl-10 pr-11 text-sm outline-none focus:ring-2 focus:ring-brand-100",
            error ? "border-rose-400" : "border-[var(--border)] focus:border-brand-500",
          )}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? t("auth.hidePassword") : t("auth.showPassword")}
          title={show ? t("auth.hidePassword") : t("auth.showPassword")}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}
