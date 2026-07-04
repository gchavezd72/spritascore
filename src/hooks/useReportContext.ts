"use client";

import { useMemo } from "react";
import type { CalculationResult } from "@/types/calculator";
import { getTranslations } from "@/i18n";
import { localizeResult } from "@/lib/localizeResult";
import { useTranslations } from "@/components/LanguageProvider";

/** Binds report/PDF content to the result's locale (not the header toggle). */
export function useReportContext(result: CalculationResult) {
  const { locale: uiLocale } = useTranslations();
  const reportLocale = result.locale ?? uiLocale;

  const localizedResult = useMemo(
    () => localizeResult(result, reportLocale),
    [result, reportLocale]
  );

  const t = useMemo(() => getTranslations(reportLocale), [reportLocale]);

  return { reportLocale, localizedResult, t };
}