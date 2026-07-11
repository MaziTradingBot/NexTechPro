"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  GitCompare,
  Menu,
  X,
  Headphones,
  Truck,
  ChevronRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useCartItems } from "@/lib/store/cart";
import { useCompareStore } from "@/lib/store/compare";
import { useAuthStore } from "@/lib/store/auth";
import { useMounted } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { CategoryId } from "@/lib/data/products";
import { cn } from "@/lib/utils";

const navCategories: CategoryId[] = [
  "phones",
  "laptops",
  "gaming",
  "audio",
  "tablets",
  "wearables",
  "accessories",
];

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl brand-gradient text-white shadow-md">
        <span className="text-lg font-black">N</span>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-slate-900">
        NexTech<span className="text-gradient">Pro</span>
      </span>
    </Link>
  );
}

export function Header() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();

  const items = useCartItems();
  const cartCount = items.reduce((n, i) => n + i.qty, 0);
  const compareCount = useCompareStore((s) => s.ids.length);
  const user = useAuthStore((s) => s.user);

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/catalog?q=${encodeURIComponent(query.trim())}` : "/catalog");
  };

  return (
    <header className="sticky top-0 z-40">
      {/* announcement bar */}
      <div className="brand-gradient text-white">
        <div className="wrap flex h-9 items-center justify-between text-xs">
          <span className="flex items-center gap-1.5">
            <Truck size={14} /> {t("topbar.delivery")}
          </span>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/support" className="flex items-center gap-1.5 hover:underline">
              <Headphones size={14} /> {t("topbar.help")}
            </Link>
            <Link href="/support" className="hover:underline">
              {t("topbar.track")}
            </Link>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="border-b border-[var(--border)] glass">
        <div className="wrap flex h-16 items-center gap-4">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-black/5 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label={t("nav.catalog")}
          >
            <Menu size={22} />
          </button>

          <Logo />

          <form onSubmit={submitSearch} className="relative ml-2 hidden flex-1 md:block">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </form>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <Link
              href="/compare"
              className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-black/5"
              aria-label={t("common.compare")}
            >
              <GitCompare size={20} />
              {mounted && compareCount > 0 && (
                <Badge>{compareCount}</Badge>
              )}
            </Link>

            <Link
              href={user ? "/account" : "/login"}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-slate-700 hover:bg-black/5"
              aria-label={t("common.account")}
            >
              <User size={20} />
              <span className="hidden text-sm font-medium lg:inline">
                {mounted && user ? user.name.split(" ")[0] : t("common.login")}
              </span>
            </Link>

            <Link
              href="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-black/5"
              aria-label={t("common.cart")}
            >
              <ShoppingCart size={20} />
              {mounted && cartCount > 0 && <Badge>{cartCount}</Badge>}
            </Link>
          </div>
        </div>

        {/* mobile search */}
        <form onSubmit={submitSearch} className="wrap pb-3 md:hidden">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-white pl-11 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </form>
      </div>

      {/* category nav (desktop) */}
      <nav className="hidden border-b border-[var(--border)] bg-white lg:block">
        <div className="wrap flex h-11 items-center gap-1 text-sm">
          <Link
            href="/catalog"
            className="rounded-lg bg-brand-50 px-3 py-1.5 font-semibold text-brand-700 hover:bg-brand-100"
          >
            {t("nav.catalog")}
          </Link>
          {navCategories.map((c) => (
            <Link
              key={c}
              href={`/catalog?category=${c}`}
              className="rounded-lg px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {t(`nav.${c}`)}
            </Link>
          ))}
        </div>
      </nav>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
              <Logo onClick={() => setMenuOpen(false)} />
              <button
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5"
                aria-label={t("common.close")}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <Link
                href="/catalog"
                className="flex items-center justify-between rounded-xl px-3 py-3 font-semibold text-brand-700"
              >
                {t("nav.catalog")} <ChevronRight size={18} />
              </Link>
              {navCategories.map((c) => (
                <Link
                  key={c}
                  href={`/catalog?category=${c}`}
                  className="flex items-center justify-between rounded-xl px-3 py-3 font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t(`nav.${c}`)} <ChevronRight size={18} className="text-slate-400" />
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border)] p-4">
              <Link
                href={user ? "/account" : "/login"}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <User size={18} /> {mounted && user ? user.name : t("common.login")}
              </Link>
              <LanguageSwitcher compact />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
      {children}
    </span>
  );
}
