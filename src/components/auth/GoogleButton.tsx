"use client";

import { useI18n } from "@/lib/i18n/provider";

export function GoogleButton({ onClick }: { onClick: () => void }) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.5 6.5 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c9.8 0 18.5-7.1 18.5-19.5 0-1.2-.1-2.3-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c2.8 0 5.4 1.1 7.3 2.8l5.7-5.7C33.5 6.5 29 4.5 24 4.5 16.3 4.5 9.7 8.8 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 43.5c5.2 0 9.6-1.7 12.9-4.6l-6-5c-1.9 1.4-4.3 2.1-6.9 2.1-5.3 0-9.7-3.6-11.3-8.4l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6 5c-.4.4 6.7-4.9 6.7-14.4 0-1.2-.1-2.3-.4-3.5z" />
      </svg>
      {t("auth.google")}
    </button>
  );
}
