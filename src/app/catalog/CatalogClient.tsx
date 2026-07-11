"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronRight } from "lucide-react";
import {
  products,
  categories,
  type CategoryId,
  type Product,
} from "@/lib/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type SortKey = "popular" | "priceAsc" | "priceDesc" | "newest" | "rating";

const sortOptions: { key: SortKey; labelKey: string }[] = [
  { key: "popular", labelKey: "sort.popular" },
  { key: "newest", labelKey: "sort.newest" },
  { key: "priceAsc", labelKey: "sort.priceAsc" },
  { key: "priceDesc", labelKey: "sort.priceDesc" },
  { key: "rating", labelKey: "sort.rating" },
];

function sortProducts(list: Product[], key: SortKey): Product[] {
  const arr = [...list];
  switch (key) {
    case "priceAsc":
      return arr.sort((a, b) => a.price - b.price);
    case "priceDesc":
      return arr.sort((a, b) => b.price - a.price);
    case "newest":
      return arr.sort((a, b) => b.createdAt - a.createdAt);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    default:
      return arr.sort((a, b) => b.popularity - a.popularity);
  }
}

export function CatalogClient() {
  const { t } = useI18n();
  const params = useSearchParams();
  const category = (params.get("category") as CategoryId | null) ?? null;
  const query = params.get("q") ?? "";
  const tag = params.get("tag") as "new" | "hit" | "sale" | null;

  const [sort, setSort] = useState<SortKey>("popular");
  const [brands, setBrands] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // products limited by category + search first, to derive brand facets
  const baseList = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.category === category);
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [category, query, tag]);

  const availableBrands = useMemo(
    () => Array.from(new Set(baseList.map((p) => p.brand))).sort(),
    [baseList],
  );

  const results = useMemo(() => {
    const filtered = brands.length
      ? baseList.filter((p) => brands.includes(p.brand))
      : baseList;
    return sortProducts(filtered, sort);
  }, [baseList, brands, sort]);

  const toggleBrand = (brand: string) =>
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );

  const tagHeading: Record<string, string> = {
    sale: t("nav.hotDeals"),
    new: t("nav.newArrivals"),
    hit: t("featured.tabPopular"),
  };
  const heading = category
    ? t(`categories.${category}`)
    : tag
      ? tagHeading[tag]
      : t("nav.catalog");

  const Sidebar = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-white">{t("common.all")}</h3>
        <ul className="space-y-1">
          <FilterLink href="/catalog" active={!category}>
            {t("nav.catalog")}
          </FilterLink>
          {categories.map((c) => (
            <FilterLink key={c.id} href={`/catalog?category=${c.id}`} active={category === c.id}>
              {t(`categories.${c.id}`)}
            </FilterLink>
          ))}
        </ul>
      </div>

      {availableBrands.length > 1 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">{t("common.brand")}</h3>
          <ul className="space-y-2">
            {availableBrands.map((brand) => (
              <li key={brand}>
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="h-4 w-4 rounded border-white/15 accent-brand-600"
                  />
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="wrap py-8">
      {/* breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-slate-400">
        <Link href="/" className="hover:text-slate-200">
          {t("common.home")}
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-slate-200">{heading}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{heading}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {results.length} {t("common.results")}
            {query && <> · “{query}”</>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-surface px-4 py-2.5 text-sm font-medium text-slate-200 lg:hidden"
          >
            <SlidersHorizontal size={16} /> {t("common.filters")}
          </button>
          <label className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-surface px-3 py-2.5 text-sm">
            <span className="hidden text-slate-400 sm:inline">{t("common.sortBy")}:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent font-medium text-slate-100 outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {t(o.labelKey)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">{Sidebar}</aside>

        <div className="flex-1">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-surface py-20 text-center">
              <p className="text-slate-400">{t("common.results")}: 0</p>
              <Link
                href="/catalog"
                className="mt-4 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {t("common.clearAll")}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{t("common.filters")}</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            {Sidebar}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white"
            >
              {t("common.continue")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "block rounded-lg px-3 py-2 text-sm transition",
          active
            ? "bg-brand-500/10 font-semibold text-brand-300"
            : "text-slate-300 hover:bg-white/5 hover:text-white",
        )}
      >
        {children}
      </Link>
    </li>
  );
}
