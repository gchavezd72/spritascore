import { EU_AI_ACT_ROUTES, getEuAiActRoute } from "@/data/euAiAct";
import { EXECUTIVE_ROUTES, getExecutiveRoute } from "@/data/executiveSoftwareRiskScore";
import { CALC05_ROUTES, getCalc05Route } from "@/i18n/calc05";
import { AUDIT_ROUTES } from "@/lib/auditRoutes";
import { regionalSibling } from "@/lib/regionalSibling";
import { isRegion, REGION_LOCALE } from "@/lib/regions";
import type { Locale } from "@/types/calculator";

export type CatalogGroup = "executive" | "technical" | "regulatory";

const LOCALIZED_ROUTES = [EXECUTIVE_ROUTES, EU_AI_ACT_ROUTES, CALC05_ROUTES, AUDIT_ROUTES];

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

/**
 * Where an explicit language choice should navigate.
 * Returns null when this page has no translated URL, so the control only saves the preference.
 */
export function languageSwitchPath(pathname: string, locale: Locale): string | null {
  const sibling = localizedSibling(pathname, locale) ?? regionalSibling(pathname, locale);
  if (sibling) return sibling;
  if (pathname === "/" || pathname === "/es" || pathname === "/pt") {
    return locale === "en" ? "/" : `/${locale}`;
  }
  return null;
}

/** Locale pinned by the URL. Unprefixed pages return null and use the saved preference or English. */
export function localeFromPath(pathname: string): Locale | null {
  for (const routes of LOCALIZED_ROUTES) {
    for (const locale of ["en", "es", "pt"] as const) {
      if (routes[locale] === pathname) return locale;
    }
  }
  if (pathname === "/analytics" || pathname.startsWith("/analytics/")) return "es";
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  if (pathname === "/pt" || pathname.startsWith("/pt/")) return "pt";
  const region = pathname.split("/").filter(Boolean)[0];
  if (region && isRegion(region)) return REGION_LOCALE[region];
  return null;
}
