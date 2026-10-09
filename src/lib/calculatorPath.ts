import { EU_AI_ACT_ROUTES, getEuAiActRoute } from "@/data/euAiAct";
import { EXECUTIVE_ROUTES, getExecutiveRoute } from "@/data/executiveSoftwareRiskScore";
import { CALC05_ROUTES, getCalc05Route } from "@/i18n/calc05";
import type { Locale } from "@/types/calculator";

export type CatalogGroup = "executive" | "technical" | "regulatory";

const LOCALIZED_ROUTES = [EXECUTIVE_ROUTES, EU_AI_ACT_ROUTES, CALC05_ROUTES];

export function catalogGroup(id: string): CatalogGroup {
  if (id === "executive-software-risk-score" || id === "sector") return "executive";
  if (id === "cra-compliance" || id === "dora-compliance" || id === "eu-ai-act-compliance") {
    return "regulatory";
  }
  return "technical";
}

export function calculatorPath(
  calc: { id: string; slug: string; customRoute?: string },
  locale: Locale
): string {
  if (calc.id === "executive-software-risk-score") return getExecutiveRoute(locale);
  if (calc.id === "eu-ai-act-compliance") return getEuAiActRoute(locale);
  if (calc.id === "sector") return getCalc05Route(locale);
  return calc.customRoute ?? `/calculadora/${calc.slug}`;
}

export function localizedSibling(pathname: string, locale: Locale): string | null {
  for (const routes of LOCALIZED_ROUTES) {
    const paths = Object.values(routes);
    if (paths.includes(pathname)) return routes[locale];
  }
  return null;
}
