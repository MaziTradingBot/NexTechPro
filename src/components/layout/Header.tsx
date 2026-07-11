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
  Flame,
  Sparkles,
  Tag,
  MessageCircle,
  LayoutGrid,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useCartItems } from "@/lib/store/cart";
import { useCompareStore } from "@/lib/store/compare";
import { useAuthStore } from "@/lib/store/auth";
import { useMounted } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { CategoryId } from "@/lib/data/products";
import { cn } from "@/lib/utils";

const mainNav = [
  { key: "catalog", href: "/catalog", Icon: LayoutGrid },
  { key: "hotDeals", href: "/catalog?tag=sale", Icon: Flame },
  { key: "newArrivals", href: "/catalog?tag=new", Icon: Sparkles },
  { key: "brands", href: "/#brands", Icon: Tag },
  { key: "support", href: "/support", Icon: MessageCircle },
];

const drawerCategories: CategoryId[] = [
  "phones",
  "laptops",
  "gaming",
  "audio",
  "tablets",
  "wearables",
  "accessories",
  "monitors",
];

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl brand-gradient text-white shadow-[0_6px_18px_-6px_rgba(34,211,238,0.7)]">
        <span className="text-lg font-black">N</span>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-white">
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

  const marquee = `${t("topbar.delivery")} · ${t("checkout.novaPoshta")} & ${t("checkout.meest")}`;

  return (
    <header className="sticky top-0 z-40">
      {/* announcement marquee */}
      <div className="border-b border-white/5 bg-ink-950 text-slate-300">
        <div className="relative overflow-hidden py-1.5">
          <div className="flex w-max animate-marquee items-center gap-10 pr-10 text-xs">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                <Zap size={12} className="text-brand-400" /> {marquee}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="border-b border-white/10 glass">
        <div className="wrap flex h-16 items-center gap-3">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-200 hover:bg-white/10 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label={t("nav.catalog")}
          >
            <Menu size={22} />
          </button>

          <Logo />

          {/* desktop nav */}
          <nav className="ml-4 hidden items-center gap-1 xl:flex">
            {mainNav.map(({ key, href, Icon }) => (
              <Link
                key={key}
                href={href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <Icon size={15} className="text-brand-400" />
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>

          <form onSubmit={submitSearch} className="relative ml-auto hidden max-w-xs flex-1 md:block">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <Link
              href="/compare"
              className="relative hidden h-10 w-10 place-items-center rounded-lg text-slate-200 hover:bg-white/10 sm:grid"
              aria-label={t("common.compare")}
            >
              <GitCompare size={20} />
              {mounted && compareCount > 0 && <Badge>{compareCount}</Badge>}
            </Link>

            <Link
              href={user ? "/account" : "/login"}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-slate-200 hover:bg-white/10"
              aria-label={t("common.account")}
            >
              <User size={20} />
              <span className="hidden text-sm font-medium lg:inline">
                {mounted && user ? user.name.split(" ")[0] : t("common.login")}
              </span>
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-xl brand-gradient px-3 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(34,211,238,0.6)]"
              aria-label={t("common.cart")}
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">{t("common.cart")}</span>
              {mounted && cartCount > 0 && <Badge>{cartCount}</Badge>}
            </Link>
          </div>
        </div>

        {/* mobile search */}
        <form onSubmit={submitSearch} className="wrap pb-3 md:hidden">
          <div className="relative">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </form>
      </div>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-ink-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <Logo onClick={() => setMenuOpen(false)} />
              <button
                onClick={() => setMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-200 hover:bg-white/10"
                aria-label={t("common.close")}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {mainNav.map(({ key, href, Icon }) => (
                <Link
                  key={key}
                  href={href}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium text-slate-200 hover:bg-white/5"
                >
                  <Icon size={18} className="text-brand-400" />
                  {t(`nav.${key}`)}
                </Link>
              ))}
              <div className="my-2 h-px bg-white/10" />
              {drawerCategories.map((c) => (
                <Link
                  key={c}
                  href={`/catalog?category=${c}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5"
                >
                  {t(`nav.${c}`)} <ChevronRight size={16} className="text-slate-500" />
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-white/10 p-4">
              <Link
                href={user ? "/account" : "/login"}
                className="flex items-center gap-2 text-sm font-medium text-slate-200"
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
    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-ink-950">
      {children}
    </span>
  );
}
