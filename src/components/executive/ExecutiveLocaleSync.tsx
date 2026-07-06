"use client";

import { useEffect } from "react";
import type { Locale } from "@/types/calculator";
import { useLocale } from "@/components/LanguageProvider";

export function ExecutiveLocaleSync({ locale }: { locale: Locale }) {
  const { setLocale } = useLocale();

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  return null;
}