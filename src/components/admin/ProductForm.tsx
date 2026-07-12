import Link from "next/link";
import type { Product } from "@prisma/client";
import { categories } from "@/lib/data/products";
import { saveProduct } from "@/app/admin/(dash)/products/actions";

const field =
  "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";
const label = "mb-1.5 block text-sm font-medium text-slate-300";

export function ProductForm({ product }: { product?: Product | null }) {
  const specs = (product?.specs as { key: string; value: string }[] | undefined) ?? [];
  const specsText = specs.map((s) => `${s.key} | ${s.value}`).join("\n");

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="text-sm text-slate-400 hover:text-white">
          ← Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white">
          {product ? "Edit product" : "New product"}
        </h1>
      </div>

      <form action={saveProduct} className="space-y-6">
        {product && <input type="hidden" name="id" value={product.id} />}

        <section className="rounded-2xl border border-white/10 bg-surface p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Basics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label}>Name</label>
              <input name="name" required defaultValue={product?.name} className={field} placeholder="NovaPhone Ultra 15 Pro" />
            </div>
            <div>
              <label className={label}>Brand</label>
              <input name="brand" required defaultValue={product?.brand} className={field} placeholder="NovaPhone" />
            </div>
            <div>
              <label className={label}>Category</label>
              <select name="category" defaultValue={product?.category ?? "phones"} className={field}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Slug (optional)</label>
              <input name="slug" defaultValue={product?.slug} className={field} placeholder="auto from name" />
            </div>
            <div>
              <label className={label}>Accent colour</label>
              <input name="accent" defaultValue={product?.accent ?? "#22d3ee"} className={field} placeholder="#22d3ee" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-surface p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Pricing &amp; stock</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={label}>Price (₴)</label>
              <input name="price" type="number" min="0" required defaultValue={product?.price} className={field} />
            </div>
            <div>
              <label className={label}>Old price (₴, optional)</label>
              <input name="oldPrice" type="number" min="0" defaultValue={product?.oldPrice ?? ""} className={field} />
            </div>
            <div>
              <label className={label}>Stock quantity</label>
              <input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} className={field} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <Checkbox name="isNewArrival" label="Newly arrived" checked={product?.isNewArrival} />
            <Checkbox name="isHotDeal" label="Hot deal" checked={product?.isHotDeal} />
            <Checkbox name="isBestseller" label="Bestseller" checked={product?.isBestseller} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-surface p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">Details</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={label}>Rating (0–5)</label>
              <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={product?.rating ?? 4.5} className={field} />
            </div>
            <div>
              <label className={label}>Reviews</label>
              <input name="reviews" type="number" min="0" defaultValue={product?.reviews ?? 0} className={field} />
            </div>
            <div>
              <label className={label}>Popularity (sort weight)</label>
              <input name="popularity" type="number" min="0" defaultValue={product?.popularity ?? 50} className={field} />
            </div>
            <div className="sm:col-span-3">
              <label className={label}>Colours (comma-separated hex)</label>
              <input name="colors" defaultValue={product?.colors?.join(", ")} className={field} placeholder="#1f2937, #e5e7eb, #4f46e5" />
            </div>
            <div className="sm:col-span-3">
              <label className={label}>Highlights (one per line)</label>
              <textarea name="highlights" rows={3} defaultValue={product?.highlights?.join("\n")} className={field + " h-auto py-2"} placeholder={"6.8″ OLED, 120Hz\nTriple 200MP camera"} />
            </div>
            <div className="sm:col-span-3">
              <label className={label}>Specifications (one per line: Label | Value)</label>
              <textarea name="specs" rows={6} defaultValue={specsText} className={field + " h-auto py-2 font-mono text-xs"} placeholder={"Display | 6.8\" OLED\nBattery | 5000 mAh"} />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <Link href="/admin/products" className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/5">
            Cancel
          </Link>
          <button type="submit" className="rounded-xl brand-gradient px-6 py-2.5 text-sm font-semibold text-white">
            {product ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Checkbox({ name, label, checked }: { name: string; label: string; checked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-200">
      <input type="checkbox" name={name} defaultChecked={checked} className="h-4 w-4 rounded border-white/20 bg-white/5 accent-brand-500" />
      {label}
    </label>
  );
}
