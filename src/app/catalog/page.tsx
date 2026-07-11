import { Suspense } from "react";
import { CatalogClient } from "./CatalogClient";

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="wrap py-20 text-center text-slate-400">Loading…</div>}>
      <CatalogClient />
    </Suspense>
  );
}
