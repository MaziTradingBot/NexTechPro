"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Package,
  MessageSquare,
  Gift,
  ShoppingBag,
  Heart,
  GitCompare,
  PackageOpen,
  Eye,
  Ticket,
  Star,
  LogOut,
  Mail,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useOrdersStore, type Order } from "@/lib/store/orders";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useRecentlyViewedStore } from "@/lib/store/recentlyViewed";
import { useToastStore } from "@/lib/store/toast";
import { useProductsByIds } from "@/lib/useProductsByIds";
import { useI18n } from "@/lib/i18n/provider";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";
import { cn } from "@/lib/utils";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { ProductCard } from "@/components/product/ProductCard";
import type { LucideIcon } from "lucide-react";

type Section = {
  id: string;
  labelKey: string;
  Icon: LucideIcon;
  href?: string;
  soon?: boolean;
};

const SECTIONS: Section[] = [
  { id: "profile", labelKey: "account.profile", Icon: User },
  { id: "orders", labelKey: "account.orders", Icon: Package },
  { id: "messages", labelKey: "account.messages", Icon: MessageSquare, soon: true },
  { id: "offers", labelKey: "account.offers", Icon: Gift, soon: true },
  { id: "wishlist", labelKey: "account.wishlist", Icon: Heart },
  { id: "basket", labelKey: "account.basket", Icon: ShoppingBag, href: "/cart" },
  { id: "comparison", labelKey: "account.comparison", Icon: GitCompare, href: "/compare" },
  { id: "viewed", labelKey: "account.viewed", Icon: Eye },
  { id: "returns", labelKey: "account.returns", Icon: PackageOpen, soon: true },
  { id: "promotions", labelKey: "account.promotions", Icon: Ticket, soon: true },
  { id: "reviews", labelKey: "account.reviews", Icon: Star, soon: true },
];

function AccountContent() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const mounted = useMounted();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orders = useOrdersStore((s) => s.orders);
  const add = useCartStore((s) => s.add);
  const pushToast = useToastStore((s) => s.push);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const viewedIds = useRecentlyViewedStore((s) => s.ids);
  const initialTab = params.get("tab");
  const [section, setSection] = useState(
    initialTab && SECTIONS.some((s) => s.id === initialTab && !s.href) ? initialTab : "profile",
  );

  const reorder = (order: Order) => {
    order.items.forEach((it) => add(it.productId, it.qty));
    pushToast(t("account.reorderedToCart"), "success");
    router.push("/cart");
  };

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
  const active = SECTIONS.find((s) => s.id === section);

  return (
    <div className="wrap py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">{t("account.title")}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* sidebar */}
        <aside className="h-fit rounded-2xl border border-[var(--border)] bg-surface p-3">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl brand-gradient text-lg font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold text-white">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <nav className="mt-2 space-y-0.5">
            {SECTIONS.map((s) => {
              const label = t(s.labelKey);
              const inner = (
                <>
                  <s.Icon size={18} className={section === s.id ? "text-brand-300" : "text-slate-400"} />
                  <span className="flex-1">{label}</span>
                  {s.soon && (
                    <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500">
                      {t("account.comingSoon")}
                    </span>
                  )}
                </>
              );
              const classes = cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                section === s.id
                  ? "bg-brand-500/12 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              );
              return s.href ? (
                <Link key={s.id} href={s.href} className={classes}>
                  {inner}
                </Link>
              ) : (
                <button key={s.id} onClick={() => setSection(s.id)} className={classes}>
                  {inner}
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={18} /> {t("account.logout")}
          </button>
        </aside>

        {/* content */}
        <div className="min-w-0">
          {section === "profile" && (
            <div className="space-y-6">
              <Panel title={t("account.profileInfo")}>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Field label={t("auth.name")} value={user.name} />
                  <Field
                    label={t("auth.email")}
                    value={user.email}
                    icon={<Mail size={15} className="text-slate-500" />}
                  />
                  <Field
                    label="Sign-in method"
                    value={user.provider === "google" ? "Google" : t("auth.email")}
                    icon={<ShieldCheck size={15} className="text-slate-500" />}
                  />
                </dl>
              </Panel>
              <Panel title={t("account.changePassword")}>
                <ChangePasswordForm />
              </Panel>
            </div>
          )}

          {section === "orders" && (
            <Panel title={t("account.orders")}>
              {myOrders.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-slate-400">{t("account.noOrders")}</p>
                  <Link
                    href="/catalog"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200"
                  >
                    {t("cart.startShopping")} <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((o) => (
                    <div key={o.id} className="rounded-xl border border-[var(--border)] bg-white/[0.02] p-4">
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
                      <div className="mt-3 space-y-1.5 border-t border-[var(--border)] pt-3 text-sm">
                        {o.items.map((it) => (
                          <div key={it.productId} className="flex justify-between gap-3">
                            <span className="line-clamp-1 text-slate-300">
                              {it.name} <span className="text-slate-500">× {it.qty}</span>
                            </span>
                            <span className="whitespace-nowrap text-slate-400">
                              {formatPrice(it.price * it.qty, locale)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
                        <span className="font-bold text-white">{formatPrice(o.total, locale)}</span>
                        <button
                          onClick={() => reorder(o)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                        >
                          <RotateCcw size={15} /> {t("account.reorder")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}

          {section === "wishlist" && (
            <Panel title={t("account.wishlist")}>
              <SavedProducts ids={wishlistIds} empty={t("account.wishlistEmpty")} />
            </Panel>
          )}

          {section === "viewed" && (
            <Panel title={t("account.viewed")}>
              <SavedProducts ids={viewedIds} empty={t("account.viewedEmpty")} />
            </Panel>
          )}

          {active?.soon && (
            <Panel title={t(active.labelKey)}>
              <div className="flex flex-col items-center py-14 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-slate-400">
                  <Clock size={26} />
                </span>
                <p className="mt-4 font-semibold text-white">{t("account.comingSoon")}</p>
                <p className="mt-1 max-w-xs text-sm text-slate-400">{t("account.comingSoonDesc")}</p>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-surface p-6">
      <h2 className="mb-5 text-lg font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 flex items-center gap-2 font-medium text-slate-100">
        {icon}
        {value}
      </dd>
    </div>
  );
}

function SavedProducts({ ids, empty }: { ids: string[]; empty: string }) {
  const { t } = useI18n();
  const products = useProductsByIds(ids);
  if (ids.length === 0 || products?.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">{empty}</p>;
  }
  if (products === null) {
    return <p className="py-10 text-center text-sm text-slate-400">{t("common.loading")}</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="wrap py-20 text-center text-slate-400">…</div>}>
      <AccountContent />
    </Suspense>
  );
}
