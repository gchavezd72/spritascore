import type { Locale, LocalizedText } from "@/types/calculator";

export function tr(value: LocalizedText, locale: Locale): string {
  if (locale === "pt" && value.pt) return value.pt;
  if (locale === "en") return value.en;
  return value.es;
}
