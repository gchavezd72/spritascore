"use client";

import { useEffect } from "react";
import type { Locale } from "@/types/calculator";
import { useTranslations } from "@/components/LanguageProvider";

export function RegionLocaleSync({ locale }: { locale: Locale }) {
  const { setLocale } = useTranslations();

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  return null;
}