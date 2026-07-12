"use client";

import { useEffect, useState } from "react";

// Guards against SSR/hydration mismatches for client-only values (cart counts, etc.)
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
