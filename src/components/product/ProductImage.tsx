"use client";

import type { Product } from "@/lib/data/products";
import { getCategoryIcon } from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";

/**
 * Generated product artwork — a branded gradient panel with the device icon.
 * Self-contained (no external images), so it always renders and stays on-brand.
 * To use real photos later, drop files in /public and render an <img> here.
 */
export function ProductImage({
  product,
  className,
  iconClassName,
}: {
  product: Product;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = getCategoryIcon(product.category);
  const accent = product.accent;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{
        background: `radial-gradient(120% 120% at 30% 20%, ${accent}22 0%, ${accent}0d 45%, transparent 70%), linear-gradient(160deg, #ffffff 0%, #f1f5f9 100%)`,
      }}
    >
      {/* soft blob */}
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
        style={{ background: `${accent}33` }}
        aria-hidden
      />
      {/* subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
          color: accent,
        }}
        aria-hidden
      />
      <div
        className="relative flex h-[46%] w-[46%] items-center justify-center rounded-3xl shadow-lg"
        style={{
          background: `linear-gradient(150deg, ${accent} 0%, ${accent}cc 100%)`,
          boxShadow: `0 18px 40px -18px ${accent}aa`,
        }}
      >
        <Icon className={cn("h-1/2 w-1/2 text-white", iconClassName)} strokeWidth={1.4} />
      </div>
    </div>
  );
}
