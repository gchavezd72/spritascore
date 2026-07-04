"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { CALCULATOR_CATEGORY_ORDER, CALCULATOR_CATEGORY_COLORS } from "@/data/calculatorCategories";
import { CalculatorIcon } from "@/components/CalculatorIcon";
import { tr } from "@/lib/translate";
import { useTranslations } from "@/components/LanguageProvider";
import type { CalculatorCategory } from "@/types/calculator";
import { cn } from "@/lib/utils";

function groupByCategory() {
  const groups = {} as Record<CalculatorCategory, typeof CALCULATOR_CONFIGS>;
  for (const cat of CALCULATOR_CATEGORY_ORDER) {
    groups[cat] = CALCULATOR_CONFIGS.filter((c) => c.category === cat);
  }
  return groups;
}

export function CalculatorsMegaMenu() {
  const { t, locale } = useTranslations();
  const groups = groupByCategory();

  return (
    <div className="relative group/menu">
      <button
        type="button"
        className="nav-underline inline-flex items-center gap-1 hover:text-brand-navy transition-colors"
        aria-haspopup="true"
      >
        {t.nav.calculators}
        <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-hover/menu:rotate-180" />
      </button>

      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[min(92vw,42rem)]",
          "opacity-0 invisible translate-y-1 pointer-events-none",
          "group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto",
          "group-focus-within/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:pointer-events-auto",
          "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
        )}
      >
        <div className="rounded-xl border border-border-hairline bg-background/95 backdrop-blur-md shadow-xl p-4 grid grid-cols-2 gap-4">
          {CALCULATOR_CATEGORY_ORDER.map((cat) => {
            const colors = CALCULATOR_CATEGORY_COLORS[cat];
            const meta = t.nav.categories[cat];
            return (
              <div key={cat} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <div className={cn("p-1.5 rounded-md border", colors.bg, colors.border, colors.text)}>
                    <CalculatorIcon category={cat} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-navy">{meta.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{meta.description}</p>
                  </div>
                </div>
                <ul className="space-y-0.5">
                  {groups[cat].map((calc) => (
                    <li key={calc.id}>
                      <Link
                        href={`/calculadora/${calc.slug}`}
                        className="block rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-brand-navy hover:bg-surface-hover transition-colors"
                      >
                        {tr(calc.title, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="col-span-2 border-t border-border-hairline pt-3">
            <Link
              href="/#calculadoras"
              className="text-xs font-semibold text-brand-green hover:underline"
            >
              {t.nav.viewAll} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}