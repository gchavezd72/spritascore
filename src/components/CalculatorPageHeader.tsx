"use client";

import type { CalculatorConfig } from "@/types/calculator";
import { tr } from "@/lib/translate";
import { useLocale } from "@/components/LanguageProvider";

export function CalculatorPageHeader({
  config,
  as = "h1",
}: {
  config: CalculatorConfig;
  as?: "h1" | "h2";
}) {
  const { locale } = useLocale();
  const Heading = as;
  return (
    <div className="text-center mb-10">
      <Heading className="text-3xl font-bold text-foreground mb-2 tracking-tight">{tr(config.title, locale)}</Heading>
      <p className="text-muted-foreground">{tr(config.shortDescription, locale)}</p>
    </div>
  );
}
