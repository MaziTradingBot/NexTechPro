"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

export function CookieConsent() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("nextech-cookies")) setShow(true);
  }, []);

  const decide = (value: "accepted" | "declined") => {
    localStorage.setItem("nextech-cookies", value);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-2xl rounded-2xl border border-white/10 bg-ink-900/95 p-4 shadow-2xl backdrop-blur sm:flex sm:items-center sm:gap-4">
      <div className="flex items-start gap-3">
        <Cookie size={22} className="mt-0.5 shrink-0 text-brand-400" />
        <p className="text-sm text-slate-300">
          {t("cookies.text")}{" "}
          <Link href="/privacy" className="font-medium text-brand-300 hover:text-brand-200">
            {t("cookies.learn")}
          </Link>
        </p>
      </div>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button
          onClick={() => decide("declined")}
          className="rounded-lg border border-white/10 px-3.5 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
        >
          {t("cookies.decline")}
        </button>
        <button
          onClick={() => decide("accepted")}
          className="rounded-lg brand-gradient px-4 py-2 text-sm font-semibold text-white"
        >
          {t("cookies.accept")}
        </button>
      </div>
    </div>
  );
}
