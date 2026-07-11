import clsx, { type ClassValue } from "clsx";
import { useEffect, useState } from "react";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Guards against SSR/hydration mismatches for client-only values (cart counts, etc.)
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
