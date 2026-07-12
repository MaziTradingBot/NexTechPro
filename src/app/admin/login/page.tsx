"use client";

import { useActionState, useState } from "react";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { loginAdmin, type LoginState } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAdmin, undefined);
  const [show, setShow] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl brand-gradient text-white shadow-[0_10px_30px_-8px_rgba(34,211,238,0.7)]">
            <Shield size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
            NexTech<span className="text-gradient">Pro</span> Admin
          </h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to the control panel</p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-3xl border border-white/10 bg-surface p-7"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@nextechpro.ua"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                name="password"
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:text-slate-200"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {state?.error && (
            <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl brand-gradient font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"} <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Staff access only · sessions are signed &amp; secure
        </p>
      </div>
    </div>
  );
}
