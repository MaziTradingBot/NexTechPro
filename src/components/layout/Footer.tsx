"use client";

import Link from "next/link";
import { Truck, ShieldCheck, CreditCard } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import type { CategoryId } from "@/lib/data/products";

const shopCats: CategoryId[] = ["phones", "laptops", "gaming", "audio", "wearables"];

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-ink-950 text-slate-300">
      <div className="wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl brand-gradient font-black text-white">
              N
            </span>
            <span className="text-xl font-extrabold text-white">
              NexTech<span className="text-gradient">Pro</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {t("footer.about")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
              <Truck size={14} className="text-brand-400" /> {t("footer.newsletterHint")}
            </span>
          </div>
        </div>

        <FooterCol title={t("footer.shop")}>
          {shopCats.map((c) => (
            <FooterLink key={c} href={`/catalog?category=${c}`}>
              {t(`nav.${c}`)}
            </FooterLink>
          ))}
          <FooterLink href="/catalog">{t("common.viewAll")}</FooterLink>
        </FooterCol>

        <FooterCol title={t("footer.company")}>
          <FooterLink href="#">{t("footer.aboutUs")}</FooterLink>
          <FooterLink href="#">{t("footer.careers")}</FooterLink>
          <FooterLink href="#">{t("footer.blog")}</FooterLink>
          <FooterLink href="#">{t("footer.contact")}</FooterLink>
        </FooterCol>

        <FooterCol title={t("footer.help")}>
          <FooterLink href="#">{t("footer.shipping")}</FooterLink>
          <FooterLink href="#">{t("footer.returns")}</FooterLink>
          <FooterLink href="#">{t("footer.warranty")}</FooterLink>
          <FooterLink href="#">{t("footer.faq")}</FooterLink>
        </FooterCol>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-4 py-6 text-sm text-slate-400 sm:flex-row">
          <p>© {year} NexTechPro. {t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-brand-400" /> {t("footer.payments")}
            </span>
            <span className="flex items-center gap-2">
              <span className="rounded bg-white/10 px-2 py-1 text-xs font-semibold">VISA</span>
              <span className="rounded bg-white/10 px-2 py-1 text-xs font-semibold">Mastercard</span>
              <CreditCard size={18} />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-slate-400 transition hover:text-white">
        {children}
      </Link>
    </li>
  );
}
