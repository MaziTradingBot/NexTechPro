"use client";

import { useState } from "react";
import type { Product } from "@/lib/data/products";
import { getCategoryIcon } from "@/components/CategoryIcon";
import { cn } from "@/lib/utils";

/**
 * Product visual: shows the real photo when `imageUrl` is set, otherwise a
 * branded generated tile. If the photo fails to load, it degrades to the tile.
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
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(product.imageUrl) && !failed;

  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 120% at 30% 15%, ${accent}33 0%, ${accent}0f 42%, transparent 70%), linear-gradient(160deg, #16161f 0%, #0e0e15 100%)`,
      }}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <>
          <div
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
            style={{ background: `${accent}40` }}
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
              color: accent,
            }}
            aria-hidden
          />
          <div
            className="relative flex h-[46%] w-[46%] items-center justify-center rounded-3xl"
            style={{
              background: `linear-gradient(150deg, ${accent} 0%, ${accent}bb 100%)`,
              boxShadow: `0 18px 50px -12px ${accent}88`,
            }}
          >
            <Icon className={cn("h-1/2 w-1/2 text-white", iconClassName)} strokeWidth={1.4} />
          </div>
        </>
      )}
    </div>
  );
}
