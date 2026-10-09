import type { Locale } from "@/types/calculator";
import { es } from "./es";
import { en } from "./en";
import { pt } from "./pt";

const translations = { es, en, pt } as const;

export function getTranslations(locale: Locale = "en") {
  return translations[locale] ?? translations.en;
}
