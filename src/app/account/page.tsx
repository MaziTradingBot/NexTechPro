"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Package, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useOrdersStore } from "@/lib/store/orders";
import { useI18n } from "@/lib/i18n/provider";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/utils";

export default function AccountPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orders = useOrdersStore((s) => s.orders);

  if (!mounted) {
    return <div className="wrap py-20 text-center text-slate-400">{t("common.loading")}</div>;
  }

  if (!user) {
    return (
      <div className="wrap py-20">
        <div className="mx-auto max-w-md rounded-3xl border border-[var(--border)] bg-surface p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-500/10 text-brand-400">
            <User size={30} />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-white">{t("common.account")}</h1>
          <p className="mt-2 text-slate-400">{t("auth.loginSubtitle")}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              {t("auth.signIn")}
            </Link>
            <Link href="/register" className="rounded-xl border border-[var(--border)] bg-surface px-6 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5">
              {t("auth.signUp")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userKey === user.id);

  return (
    <div className="wrap py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">{t("account.title")}</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* profile card */}
        <div className="h-fit rounded-2xl border border-[var(--border)] bg-surface p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl brand-gradient text-xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-xs text-slate-400">{t("account.hello")}</p>
              <p className="font-bold text-white">{user.name}</p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail size={16} className="text-slate-400" /> {user.email}
            </div>
            <div className="flex items-center gap-2.5 text-slate-300">
              <ShieldCheck size={16} className="text-slate-400" />
              {user.provider === "google" ? "Google" : t("auth.email")}
            </div>
          </dl>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-3 text-sm font-semibold text-slate-200 transition hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={16} /> {t("account.logout")}
          </button>
        </div>

        {/* orders */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            <Package size={20} /> {t("account.orders")}
          </h2>

          {myOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-surface py-16 text-center">
              <p className="text-slate-400">{t("account.noOrders")}</p>
              <Link
                href="/catalog"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
              >
                {t("cart.startShopping")} <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((o) => (
                <div key={o.id} className="rounded-2xl border border-[var(--border)] bg-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-mono font-bold text-brand-300">{o.id}</span>
                      <span className="ml-3 text-xs text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString(locale === "uk" ? "uk-UA" : "en-US")}
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                      {t("success.days")}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
                    <span className="text-slate-400">
                      {o.items.reduce((n, i) => n + i.qty, 0)} × {t("cart.item")}
                    </span>
                    <span className="font-bold text-white">{formatPrice(o.total, locale)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
