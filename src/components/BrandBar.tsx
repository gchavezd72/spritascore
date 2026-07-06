"use client";

import { BrandAttribution } from "@/components/BrandAttribution";
import { useTranslations } from "@/components/LanguageProvider";

export function BrandBar() {
  const { locale } = useTranslations();
  return <BrandAttribution variant="bar" locale={locale} />;
}

export function BrandFooterLine() {
  const { locale } = useTranslations();
  return <BrandAttribution variant="footer" locale={locale} />;
}