"use client";

import Link from "next/link";
import { Headphones, Truck, ShieldCheck, CreditCard, Mail, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export default function SupportPage() {
  const { t } = useI18n();
  const cards = [
    { Icon: Truck, title: t("footer.shipping"), desc: t("product.delivery") },
    { Icon: ShieldCheck, title: t("footer.warranty"), desc: t("product.warranty") },
    { Icon: CreditCard, title: t("footer.payments"), desc: t("product.securePay") },
  ];

  return (
    <div className="wrap py-12">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl brand-gradient text-white">
          <Headphones size={26} />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
          {t("nav.support")}
        </h1>
        <p className="mt-2 text-slate-400">{t("benefits.support.desc")}</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {cards.map(({ Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-[var(--border)] bg-surface p-5 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-400">
              <Icon size={22} />
            </span>
            <h3 className="mt-3 font-semibold text-white">{title}</h3>
            <p className="mt-1 text-xs text-slate-400">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 rounded-2xl border border-[var(--border)] bg-surface p-6 sm:flex-row sm:justify-center">
        <a href="tel:+380000000000" className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
          <Phone size={16} /> +380 00 000 00 00
        </a>
        <a href="mailto:help@nextechpro.ua" className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5">
          <Mail size={16} /> help@nextechpro.ua
        </a>
      </div>

      <p className="mt-8 text-center">
        <Link href="/catalog" className="text-sm font-semibold text-brand-300 hover:text-brand-200">
          ← {t("cart.continueShopping")}
        </Link>
      </p>
    </div>
  );
}
