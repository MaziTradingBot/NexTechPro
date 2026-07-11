import type { Locale } from "./i18n/dictionaries";

// Prices are stored in Ukrainian hryvnia (UAH / ₴).
export function formatPrice(value: number, locale: Locale = "uk"): string {
  const formatted = new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted} ₴`;
}

export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
