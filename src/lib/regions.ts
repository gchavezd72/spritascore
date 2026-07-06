import type { Locale } from "@/types/calculator";

export const REGIONS = ["es-es", "en-us", "en-eu", "pt-pt"] as const;
export type Region = (typeof REGIONS)[number];

export const REGION_LOCALE: Record<Region, Locale> = {
  "es-es": "es",
  "en-us": "en",
  "en-eu": "en",
  "pt-pt": "pt",
};

export const REGION_LABEL: Record<Region, string> = {
  "es-es": "España / LATAM",
  "en-us": "United States",
  "en-eu": "European Union",
  "pt-pt": "Portugal / Brasil",
};

export const REGION_HREFLANG: Record<Region, string> = {
  "es-es": "es-ES",
  "en-us": "en-US",
  "en-eu": "en-GB",
  "pt-pt": "pt-PT",
};

export function isRegion(value: string): value is Region {
  return REGIONS.includes(value as Region);
}

export function calcSection(region: Region): "calculadoras" | "calculators" {
  return region === "es-es" || region === "pt-pt" ? "calculadoras" : "calculators";
}

export function guidesSection(region: Region): "guias" | "guides" {
  return region === "es-es" || region === "pt-pt" ? "guias" : "guides";
}

export function methodologySection(region: Region): "metodologia" | "methodology" {
  return region === "es-es" || region === "pt-pt" ? "metodologia" : "methodology";
}

export function regionPath(region: Region, ...segments: string[]): string {
  return `/${region}/${segments.filter(Boolean).join("/")}`;
}

export type ContentMarket = "us" | "eu" | "es" | "pt";

export function marketForRegion(region: Region): ContentMarket {
  if (region === "en-us") return "us";
  if (region === "en-eu") return "eu";
  if (region === "pt-pt") return "pt";
  return "es";
}