import type { Locale } from "@/types/calculator";

export const LOCALE_COOKIE = "spritascore_locale";
export const DEFAULT_LOCALE: Locale = "en";

const COOKIE_ATTRIBUTES = "; Path=/; Max-Age=31536000; SameSite=Lax";

export function readLocaleCookie(value: string | null | undefined): Locale {
  return value === "en" || value === "pt" || value === "es" ? value : DEFAULT_LOCALE;
}

/** Reads only an allowlisted locale. Anything else is ignored. */
export function localeFromCookieHeader(header: string | null | undefined): Locale | null {
  if (!header) return null;
  const match = header.match(/(?:^|;)\s*spritascore_locale=(en|es|pt)(?=;|$)/);
  if (!match) return null;
  return readLocaleCookie(match[1]);
}

function localeAssignment(locale: Locale): string {
  switch (locale) {
    case "es":
      return "spritascore_locale=es";
    case "pt":
      return "spritascore_locale=pt";
    case "en":
      return "spritascore_locale=en";
    default:
      return "spritascore_locale=en";
  }
}

export function localeCookieString(locale: Locale, secure = false): string {
  const suffix = secure ? `${COOKIE_ATTRIBUTES}; Secure` : COOKIE_ATTRIBUTES;
  return localeAssignment(locale) + suffix;
}

/** Client-only. The value is one of three literals. Secure is added only on HTTPS. */
export function writeLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = localeCookieString(locale, secure);
}
