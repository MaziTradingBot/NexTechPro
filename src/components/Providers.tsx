"use client";

import { useEffect } from "react";
import { I18nProvider } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { useAuthStore } from "@/lib/store/auth";
import { useCartStore } from "@/lib/store/cart";

/** Keeps the active cart bound to the signed-in user (or "guest"). */
function CartUserSync() {
  const user = useAuthStore((s) => s.user);
  const setActiveUser = useCartStore((s) => s.setActiveUser);
  useEffect(() => {
    setActiveUser(user?.id ?? "guest");
  }, [user, setActiveUser]);
  return null;
}

export function Providers({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <CartUserSync />
      {children}
    </I18nProvider>
  );
}
