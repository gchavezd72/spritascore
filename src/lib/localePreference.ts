import type { Locale } from "@/types/calculator";

export const LOCALE_COOKIE = "spritascore_locale";
export const DEFAULT_LOCALE: Locale = "en";

export function readLocaleCookie(value: string | null | undefined): Locale {
  return value === "en" || value === "pt" || value === "es" ? value : DEFAULT_LOCALE;
}

export function localeCookieString(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
