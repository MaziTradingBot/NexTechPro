"use client";

import Link from "next/link";
import { X, GitCompare, ShoppingCart, ArrowRight } from "lucide-react";
import { useCompareStore } from "@/lib/store/compare";
import { useCartStore } from "@/lib/store/cart";
import { useToastStore } from "@/lib/store/toast";
import { getProductById } from "@/lib/data/products";
import { useI18n } from "@/lib/i18n/provider";
import { formatPrice } from "@/lib/format";
import { useMounted } from "@/lib/utils";
import { ProductImage } from "@/components/product/ProductImage";
import { Stars } from "@/components/ui/Stars";

export default function ComparePage() {
  const { t, locale } = useI18n();
  const mounted = useMounted();
  const ids = useCompareStore((s) => s.ids);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const add = useCartStore((s) => s.add);
  const pushToast = useToastStore((s) => s.push);

  const items = ids.map((id) => getProductById(id)).filter(Boolean);

  if (!mounted) {
    return <div className="wrap py-20 text-center text-slate-400">{t("common.loading")}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="wrap py-20">
        <div className="mx-auto max-w-md rounded-3xl border border-[var(--border)] bg-white p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <GitCompare size={30} />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">{t("common.compare")}</h1>
          <p className="mt-2 text-slate-500">{t("common.addedToCompare")} — 0</p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {t("cart.startShopping")} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // union of spec keys, preserving order of appearance
  const specKeys: string[] = [];
  items.forEach((p) => p!.specs.forEach((s) => !specKeys.includes(s.key) && specKeys.push(s.key)));

  const specValue = (productId: string, key: string) =>
    getProductById(productId)?.specs.find((s) => s.key === key)?.value ?? "—";

  return (
    <div className="wrap py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t("common.compare")}</h1>
        <button onClick={clear} className="text-sm font-medium text-slate-400 hover:text-rose-500">
          {t("common.clearAll")}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-white">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 bg-white p-4 text-left align-top" />
              {items.map((p) => (
                <th key={p!.id} className="min-w-[200px] border-l border-[var(--border)] p-4 align-top">
                  <div className="relative">
                    <button
                      onClick={() => remove(p!.id)}
                      className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-500"
                      aria-label={t("common.remove")}
                    >
                      <X size={15} />
                    </button>
                    <Link href={`/product/${p!.slug}`}>
                      <ProductImage product={p!} className="mx-auto h-28 w-28 rounded-xl" iconClassName="h-1/2 w-1/2" />
                      <p className="mt-3 line-clamp-2 text-left font-semibold text-slate-900">{p!.name}</p>
                    </Link>
                    <p className="mt-1 text-left text-base font-bold text-slate-900">
                      {formatPrice(p!.price, locale)}
                    </p>
                    <button
                      onClick={() => {
                        add(p!.id);
                        pushToast(`${p!.name} · ${t("common.addedToCart")}`, "success");
                      }}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      <ShoppingCart size={14} /> {t("common.addToCart")}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SpecRow label={t("common.reviews")} sticky>
              {items.map((p) => (
                <td key={p!.id} className="border-l border-[var(--border)] p-4">
                  <div className="flex items-center gap-1.5">
                    <Stars rating={p!.rating} />
                    <span className="font-medium text-slate-700">{p!.rating}</span>
                  </div>
                </td>
              ))}
            </SpecRow>
            <SpecRow label={t("common.brand")}>
              {items.map((p) => (
                <td key={p!.id} className="border-l border-[var(--border)] p-4 font-medium text-slate-700">
                  {p!.brand}
                </td>
              ))}
            </SpecRow>
            {specKeys.map((key, i) => (
              <SpecRow key={key} label={t(`spec.${key}`)} zebra={i % 2 === 0}>
                {items.map((p) => (
                  <td key={p!.id} className="border-l border-[var(--border)] p-4 text-slate-700">
                    {specValue(p!.id, key)}
                  </td>
                ))}
              </SpecRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SpecRow({
  label,
  children,
  zebra,
  sticky,
}: {
  label: string;
  children: React.ReactNode;
  zebra?: boolean;
  sticky?: boolean;
}) {
  return (
    <tr className={zebra ? "bg-slate-50/50" : "bg-white"}>
      <th
        className={`${
          zebra ? "bg-slate-50/50" : "bg-white"
        } sticky left-0 z-10 p-4 text-left align-top text-xs font-semibold uppercase tracking-wide text-slate-400`}
        scope="row"
      >
        {label}
      </th>
      {children}
    </tr>
  );
}
