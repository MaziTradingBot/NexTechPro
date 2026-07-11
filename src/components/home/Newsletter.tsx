"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  };

  return (
    <section className="wrap pb-4">
      <div className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-brand-50 to-white p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl brand-gradient text-white">
            <Mail size={22} />
          </span>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {t("newsletter.title")}
          </h2>
          <p className="mt-2 text-slate-500">{t("newsletter.subtitle")}</p>

          {done ? (
            <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
              <Check size={18} /> {t("newsletter.success")}
            </p>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter.placeholder")}
                className="h-12 flex-1 rounded-xl border border-[var(--border)] bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="submit"
                className="h-12 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                {t("newsletter.button")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
