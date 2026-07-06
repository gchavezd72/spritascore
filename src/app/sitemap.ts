import type { MetadataRoute } from "next";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { allPublicSeoPaths } from "@/lib/seoRoutes";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const legacyCalculators = CALCULATOR_CONFIGS.map((calc) => ({
    url: `${SITE_URL}/calculadora/${calc.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const regionalPages = allPublicSeoPaths()
    .filter((p) => p !== "/")
    .map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: path.includes("guias") || path.includes("guides") ? ("monthly" as const) : ("weekly" as const),
      priority: path.includes("calculador") ? 0.9 : path.match(/^\/(es-es|en-us|en-eu|pt-pt)$/) ? 0.95 : 0.7,
    }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...regionalPages,
    ...legacyCalculators,
  ];
}