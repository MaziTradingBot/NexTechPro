"use client";

import { useState } from "react";
import { Mail, Phone, Truck, Send, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export default function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  const field =
    "h-12 w-full rounded-xl border border-[var(--border)] bg-surface px-3.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="wrap max-w-4xl py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">{t("footer.contact")}</h1>
      <p className="mt-2 text-slate-400">{t("benefits.support.desc")}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3">
          <a
            href="tel:+380000000000"
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-surface p-4 hover:border-brand-500/40"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-400">
              <Phone size={18} />
            </span>
            <span>
              <span className="block text-xs text-slate-500">Phone</span>
              <span className="font-semibold text-white">+380 00 000 00 00</span>
            </span>
          </a>
          <a
            href="mailto:help@nextechpro.ua"
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-surface p-4 hover:border-brand-500/40"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-400">
              <Mail size={18} />
            </span>
            <span>
              <span className="block text-xs text-slate-500">Email</span>
              <span className="font-semibold text-white">help@nextechpro.ua</span>
            </span>
          </a>
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-surface p-4">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-400">
              <Truck size={18} />
            </span>
            <span>
              <span className="block text-xs text-slate-500">Delivery</span>
              <span className="font-semibold text-white">{t("footer.newsletterHint")} · 1–5 days</span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-surface p-6">
          {sent ? (
            <p className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
              <Check size={18} /> Thanks! We&apos;ll get back to you shortly.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <input required placeholder={t("auth.name")} className={field} />
              <input required type="email" placeholder={t("auth.email")} className={field} />
              <textarea
                required
                rows={4}
                placeholder="How can we help?"
                className={field + " h-auto py-2.5"}
              />
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl brand-gradient font-semibold text-white transition hover:opacity-90"
              >
                <Send size={17} /> Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
