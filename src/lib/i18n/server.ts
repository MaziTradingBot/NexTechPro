import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "./dictionaries";

// Read the visitor's saved locale from the cookie (Next.js 16: cookies() is async).
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get("locale")?.value as Locale | undefined;
  return value && locales.includes(value) ? value : defaultLocale;
}
