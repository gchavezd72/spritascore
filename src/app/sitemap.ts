import type { MetadataRoute } from "next";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const calculators = CALCULATOR_CONFIGS.map((calc) => ({
    url: `${SITE_URL}/calculadora/${calc.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...calculators,
  ];
}