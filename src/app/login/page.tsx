"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useAuthStore } from "@/lib/store/auth";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error === "not-found" ? t("auth.demoNote") : t("auth.passwordsNoMatch"));
      return;
    }
    router.push("/account");
  };

  const google = () => {
    loginWithGoogle();
    router.push("/account");
  };

  return (
    <div className="wrap flex justify-center py-14">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[var(--border)] bg-surface p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">{t("auth.loginTitle")}</h1>
          <p className="mt-1.5 text-sm text-slate-400">{t("auth.loginSubtitle")}</p>

          <div className="mt-6">
            <GoogleButton onClick={google} />
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
            <span className="h-px flex-1 bg-[var(--border)]" />
            {t("auth.orEmail")}
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">{t("auth.email")}</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-[var(--border)] bg-surface pl-10 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
            </div>

            <PasswordInput
              label={t("auth.password")}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <Link href="#" className="text-sm font-medium text-brand-300 hover:text-brand-200">
                {t("auth.forgot")}
              </Link>
            </div>

            {error && (
              <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400">{error}</p>
            )}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white transition hover:bg-brand-700"
            >
              {t("auth.signIn")} <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="font-semibold text-brand-300 hover:text-brand-200">
              {t("auth.signUp")}
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">{t("auth.demoNote")}</p>
      </div>
    </div>
  );
}
