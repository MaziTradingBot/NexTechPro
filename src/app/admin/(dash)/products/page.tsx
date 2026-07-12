import Link from "next/link";
import { Plus, Pencil, Trash2, Sparkles, Flame, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { deleteProduct, setFlag } from "./actions";
import { ConfirmForm } from "@/components/admin/ConfirmForm";

export const dynamic = "force-dynamic";

const flagDefs = [
  { field: "isNewArrival", label: "New", Icon: Sparkles },
  { field: "isHotDeal", label: "Hot", Icon: Flame },
  { field: "isBestseller", label: "Best", Icon: Star },
] as const;

export default async function AdminProductsPage() {
  await requireAdmin(["GENERAL"]);
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Products</h1>
          <p className="mt-1 text-sm text-slate-400">{products.length} items in the catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl brand-gradient px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={17} /> Add product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Stock</th>
              <th className="px-5 py-3 font-semibold">Flags</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.03]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xs font-bold text-white"
                      style={{ background: p.accent }}
                    >
                      {p.brand.charAt(0)}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-xs text-slate-500">
                        {p.brand} · {p.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="font-semibold text-white">{formatPrice(p.price, "en")}</span>
                  {p.oldPrice ? (
                    <span className="ml-1.5 text-xs text-slate-500 line-through">
                      {formatPrice(p.oldPrice, "en")}
                    </span>
                  ) : null}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                      p.stock <= 0
                        ? "bg-rose-500/15 text-rose-300"
                        : p.stock < 5
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-emerald-500/15 text-emerald-300",
                    )}
                  >
                    {p.stock <= 0 ? "Out of stock" : `${p.stock} in stock`}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    {flagDefs.map(({ field, label, Icon }) => {
                      const active = p[field];
                      return (
                        <form key={field} action={setFlag}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="field" value={field} />
                          <input type="hidden" name="value" value={(!active).toString()} />
                          <button
                            type="submit"
                            title={`Toggle ${label}`}
                            className={cn(
                              "flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition",
                              active
                                ? "bg-brand-500/20 text-brand-300"
                                : "bg-white/5 text-slate-500 hover:text-slate-300",
                            )}
                          >
                            <Icon size={12} /> {label}
                          </button>
                        </form>
                      );
                    })}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <ConfirmForm
                      action={deleteProduct}
                      hidden={{ id: p.id }}
                      message={`Delete "${p.name}"? This cannot be undone.`}
                    >
                      <button
                        type="submit"
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </ConfirmForm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
