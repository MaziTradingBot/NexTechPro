import { Suspense } from "react";
import { CatalogClient } from "./CatalogClient";
import { getAllProducts } from "@/lib/products-db";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getAllProducts();
  return (
    <Suspense fallback={<div className="wrap py-20 text-center text-slate-400">Loading…</div>}>
      <CatalogClient allProducts={products} />
    </Suspense>
  );
}
