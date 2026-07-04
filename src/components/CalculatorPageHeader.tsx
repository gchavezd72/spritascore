"use client";

import type { CalculatorConfig } from "@/types/calculator";
import { tr } from "@/lib/translate";
import { useLocale } from "@/components/LanguageProvider";

export function CalculatorPageHeader({ config }: { config: CalculatorConfig }) {
  const { locale } = useLocale();
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{tr(config.title, locale)}</h1>
      <p className="text-muted-foreground">{tr(config.shortDescription, locale)}</p>
    </div>
  );
}
