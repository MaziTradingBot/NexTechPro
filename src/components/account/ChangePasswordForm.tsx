"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useI18n } from "@/lib/i18n/provider";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { cn } from "@/lib/utils";

export function ChangePasswordForm() {
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);
  const changePassword = useAuthStore((s) => s.changePassword);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ ok?: boolean; text: string } | null>(null);

  if (user?.provider === "google") {
    return (
      <p className="max-w-md rounded-xl bg-white/5 p-4 text-sm text-slate-400">
        {t("account.googlePassword")}
      </p>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      setMsg({ text: t("auth.passwordsNoMatch") });
      return;
    }
    const res = changePassword(current, next);
    if (!res.ok) {
      const text =
        res.error === "too-short"
          ? t("auth.minPassword")
          : res.error === "wrong-password"
            ? t("account.wrongCurrent")
            : t("account.googlePassword");
      setMsg({ text });
      return;
    }
    setMsg({ ok: true, text: t("account.passwordChanged") });
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  return (
    <form onSubmit={submit} className="max-w-md space-y-4">
      <PasswordInput
        label={t("account.currentPassword")}
        value={current}
        onChange={setCurrent}
        autoComplete="current-password"
      />
      <PasswordInput
        label={t("account.newPassword")}
        value={next}
        onChange={setNext}
        autoComplete="new-password"
      />
      <PasswordInput
        label={t("account.confirmNewPassword")}
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
      />
      {msg && (
        <p
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium",
            msg.ok ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400",
          )}
        >
          {msg.ok && <Check size={16} />}
          {msg.text}
        </p>
      )}
      <button
        type="submit"
        className="rounded-xl brand-gradient px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
      >
        {t("account.save")}
      </button>
    </form>
  );
}
