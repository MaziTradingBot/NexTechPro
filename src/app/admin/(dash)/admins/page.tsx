import { Trash2, ShieldCheck, Wallet, Truck } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { NewAdminForm } from "./NewAdminForm";
import { updateRole, deleteAdmin } from "./actions";
import { ConfirmForm } from "@/components/admin/ConfirmForm";

export const dynamic = "force-dynamic";

const roleMeta: Record<string, { label: string; Icon: typeof ShieldCheck; color: string }> = {
  GENERAL: { label: "General admin", Icon: ShieldCheck, color: "#22d3ee" },
  PAYMENT: { label: "Payment admin", Icon: Wallet, color: "#10b981" },
  DELIVERY: { label: "Delivery admin", Icon: Truck, color: "#8b5cf6" },
};

export default async function AdminsPage() {
  const session = await requireAdmin(["GENERAL"]);
  const admins = await prisma.admin.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Admins</h1>
        <p className="mt-1 text-sm text-slate-400">Create staff accounts and assign roles.</p>
      </div>

      <div className="mb-6">
        <NewAdminForm />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-surface">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-semibold">Admin</th>
              <th className="px-5 py-3 font-semibold">Role</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {admins.map((a) => {
              const meta = roleMeta[a.role];
              const isSelf = a.id === session.id;
              return (
                <tr key={a.id} className="hover:bg-white/[0.03]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-9 w-9 place-items-center rounded-lg text-sm font-bold text-white"
                        style={{ background: meta.color }}
                      >
                        {a.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold text-white">
                          {a.name}
                          {isSelf && <span className="ml-2 text-xs text-slate-500">(you)</span>}
                        </p>
                        <p className="text-xs text-slate-500">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {isSelf ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{ background: `${meta.color}1f`, color: meta.color }}
                      >
                        <meta.Icon size={13} /> {meta.label}
                      </span>
                    ) : (
                      <form action={updateRole} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={a.id} />
                        <select
                          name="role"
                          defaultValue={a.role}
                          className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white outline-none focus:border-brand-500"
                        >
                          <option value="GENERAL">General admin</option>
                          <option value="PAYMENT">Payment admin</option>
                          <option value="DELIVERY">Delivery admin</option>
                        </select>
                        <button className="rounded-lg bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10">
                          Save
                        </button>
                      </form>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      {isSelf ? (
                        <span className="text-xs text-slate-600">—</span>
                      ) : (
                        <ConfirmForm
                          action={deleteAdmin}
                          hidden={{ id: a.id }}
                          message={`Remove admin "${a.name}"?`}
                        >
                          <button
                            className={cn(
                              "grid h-8 w-8 place-items-center rounded-lg text-slate-400",
                              "hover:bg-rose-500/10 hover:text-rose-400",
                            )}
                            title="Remove admin"
                          >
                            <Trash2 size={16} />
                          </button>
                        </ConfirmForm>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
