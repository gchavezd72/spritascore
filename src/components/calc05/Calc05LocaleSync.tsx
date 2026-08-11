"use client";

import { useEffect } from "react";
import type { Locale } from "@/types/calculator";
import { useLocale } from "@/components/LanguageProvider";

export function Calc05LocaleSync({ locale }: { locale: Locale }) {
  const { setLocale } = useLocale();

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  return null;
}
