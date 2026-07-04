import type { Locale, LocalizedText } from "@/types/calculator";

export function tr(value: LocalizedText, locale: Locale): string {
  if (locale === "pt" && value.pt) return value.pt;
  if (locale === "en") return value.en;
  return value.es;
}

/** Pick inline copy for es / en / pt (used in calculateCost summaries). */
export function pickLocale<T>(locale: Locale, texts: { es: T; en: T; pt: T }): T {
  if (locale === "en") return texts.en;
  if (locale === "pt") return texts.pt;
  return texts.es;
}

export function localeDateTag(locale: Locale): string {
  if (locale === "en") return "en-US";
  if (locale === "pt") return "pt-BR";
  return "es-ES";
}
