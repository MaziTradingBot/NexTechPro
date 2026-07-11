"use client";

import { products } from "@/lib/data/products";

export function BrandMarquee() {
  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const row = [...brands, ...brands];

  return (
    <section className="border-y border-[var(--border)] bg-white py-6">
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-14 pr-14">
          {row.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="whitespace-nowrap text-lg font-bold tracking-tight text-slate-300 transition hover:text-slate-500"
            >
              {brand}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
