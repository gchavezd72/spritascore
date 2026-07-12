"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { getExecutiveRoute } from "@/data/executiveSoftwareRiskScore";
import { getEuAiActRoute } from "@/data/euAiAct";
import { CALCULATOR_CATEGORY_ORDER, CALCULATOR_CATEGORY_COLORS } from "@/data/calculatorCategories";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { CalculatorIcon } from "@/components/CalculatorIcon";
import { formatTemplate, tr } from "@/lib/translate";
import { useTranslations } from "@/components/LanguageProvider";
import type { CalculatorCategory } from "@/types/calculator";
import { cn } from "@/lib/utils";

const COMPLEXITY_COLORS = {
  baja: "outline" as const,
  media: "moderado" as const,
  alta: "alto" as const,
};

type FilterValue = CalculatorCategory | "all";

export function CalculatorSelector() {
  const { t, locale } = useTranslations();
  const [filter, setFilter] = useState<FilterValue>("all");

  const sorted = [...CALCULATOR_CONFIGS].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
  );

  const filtered =
    filter === "all"
      ? sorted
      : sorted.filter((calc) => calc.category === filter);

  const tabs: { id: FilterValue; label: string }[] = [
    { id: "all", label: t.calculatorSelector.filterAll },
    ...CALCULATOR_CATEGORY_ORDER.map((cat) => ({
      id: cat,
      label: t.calculatorSelector.categories[cat],
    })),
  ];

  return (
    <section id="calculadoras" className="py-20 bg-surface border-t border-border-hairline">
      <div className="container mx-auto px-4 max-w-7xl">
        <Reveal>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4 tracking-tight">
              {t.calculatorSelector.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {formatTemplate(t.calculatorSelector.subtitle, {
                count: CALCULATOR_CONFIGS.length,
              })}
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div
            className="flex flex-wrap justify-center gap-2 mb-12"
            role="tablist"
            aria-label={t.calculatorSelector.title}
          >
            {tabs.map((tab) => {
              const colors =
                tab.id !== "all" ? CALCULATOR_CATEGORY_COLORS[tab.id] : null;
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200",
                    active
                      ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                      : "bg-background text-muted-foreground border-border-strong hover:border-brand-navy/30 hover:text-brand-navy"
                  )}
                >
                  {tab.id !== "all" && (
                    <CalculatorIcon
                      category={tab.id}
                      className={cn("h-4 w-4", active ? "text-brand-green" : colors?.text)}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((calc, i) => {
            const colors = CALCULATOR_CATEGORY_COLORS[calc.category];
            return (
              <Reveal key={calc.id} delay={(i % 2) * 80 + Math.floor(i / 2) * 60}>
                <Card className="lift hover:border-brand-green/40 group h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-3 rounded-xl border transition-colors",
                            colors.bg,
                            colors.border,
                            colors.text,
                            "group-hover:bg-brand-green/10 group-hover:border-brand-green/30 group-hover:text-brand-green"
                          )}
                        >
                          <CalculatorIcon id={calc.id} className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={cn("text-[10px] uppercase tracking-wider", colors.text, colors.border)}
                            >
                              {calc.badge ? tr(calc.badge, locale) : t.calculatorSelector.categories[calc.category]}
                            </Badge>
                            {calc.audience && (
                              <Badge variant="outline" className="text-[10px]">
                                {tr(calc.audience, locale)}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{tr(calc.title, locale)}</CardTitle>
                          {calc.kicker && (
                            <p className="text-xs text-muted-foreground mt-1">{tr(calc.kicker, locale)}</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge variant={COMPLEXITY_COLORS[calc.complexity]}>
                              {t.calculatorSelector.complexity}{" "}
                              {t.calculatorSelector.complexityLabels[calc.complexity]}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {tr(calc.estimatedTime, locale)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-6 leading-relaxed">
                      {tr(calc.shortDescription, locale)}
                    </CardDescription>
                    <Link
                      href={
                        calc.id === "executive-software-risk-score"
                          ? getExecutiveRoute(locale)
                          : calc.id === "eu-ai-act-compliance"
                            ? getEuAiActRoute(locale)
                            : (calc.customRoute ?? `/calculadora/${calc.slug}`)
                      }
                    >
                      <Button className="w-full">
                        {calc.ctaLabel ? tr(calc.ctaLabel, locale) : t.calculatorSelector.start}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}