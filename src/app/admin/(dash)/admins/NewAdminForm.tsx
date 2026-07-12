"use client";

import { useActionState, useEffect, useRef } from "react";
import { UserPlus } from "lucide-react";
import { createAdmin, type CreateAdminState } from "./actions";

const field =
  "h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30";

export function NewAdminForm() {
  const [state, formAction, pending] = useActionState<CreateAdminState, FormData>(
    createAdmin,
    undefined,
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form
      ref={ref}
      action={formAction}
      className="rounded-2xl border border-white/10 bg-surface p-5"
    >
      <h2 className="mb-4 flex items-center gap-2 font-bold text-white">
        <UserPlus size={18} /> Add an admin
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" placeholder="Full name" required className={field} />
        <input name="email" type="email" placeholder="Email" required className={field} />
        <input
          name="password"
          type="password"
          placeholder="Temporary password"
          required
          className={field}
        />
        <select name="role" defaultValue="DELIVERY" className={field}>
          <option value="GENERAL">General admin</option>
          <option value="PAYMENT">Payment admin</option>
          <option value="DELIVERY">Delivery admin</option>
        </select>
      </div>

      {state?.error && (
        <p className="mt-3 rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm font-medium text-rose-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="mt-3 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400">
          Admin created.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-xl brand-gradient px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create admin"}
      </button>
    </form>
  );
}
