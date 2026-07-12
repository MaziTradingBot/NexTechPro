"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/data/products";

/** Fetches product details by id from /api/products. Returns null while loading. */
export function useProductsByIds(ids: string[]): Product[] | null {
  const [products, setProducts] = useState<Product[] | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!key) {
      setProducts([]);
      return;
    }
    let active = true;
    setProducts(null);
    fetch(`/api/products?ids=${encodeURIComponent(key)}`)
      .then((r) => r.json())
      .then((d) => active && setProducts(d.products ?? []))
      .catch(() => active && setProducts([]));
    return () => {
      active = false;
    };
  }, [key]);

  return products;
}
