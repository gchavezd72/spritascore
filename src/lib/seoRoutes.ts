import type { CalculatorId } from "@/types/calculator";
import {
  calcSection,
  guidesSection,
  methodologySection,
  REGION_HREFLANG,
  type Region,
  regionPath,
} from "@/lib/regions";
import { absoluteUrl } from "@/lib/seo";

export type SeoSection = "calculators" | "calculadoras" | "guides" | "guias" | "methodology" | "metodologia";

export interface CalculatorSeoRoute {
  id: CalculatorId;
  internalSlug: string;
  slugs: Record<Region, string>;
}

export const CALCULATOR_SEO_ROUTES: CalculatorSeoRoute[] = [
  {
    id: "iso-quality",
    internalSlug: "no-calidad-codigo",
    slugs: {
      "es-es": "costo-no-calidad-codigo",
      "en-us": "technical-debt-cost",
      "en-eu": "technical-debt-cost",
      "pt-pt": "custo-nao-qualidade-codigo",
    },
  },
  {
    id: "owasp-web",
    internalSlug: "owasp-top10-web",
    slugs: {
      "es-es": "costo-vulnerabilidad-owasp-top10",
      "en-us": "owasp-top-10-cost",
      "en-eu": "owasp-top-10-cost",
      "pt-pt": "custo-vulnerabilidade-owasp-top10",
    },
  },
  {
    id: "owasp-mobile",
    internalSlug: "owasp-mobile-top10",
    slugs: {
      "es-es": "owasp-mobile-top10",
      "en-us": "owasp-mobile-top-10-cost",
      "en-eu": "owasp-mobile-top-10-cost",
      "pt-pt": "owasp-mobile-top10",
    },
  },
  {
    id: "sector",
    internalSlug: "riesgo-por-sector",
    slugs: {
      "es-es": "riesgo-por-sector",
      "en-us": "sector-risk-cost",
      "en-eu": "software-supply-chain-risk",
      "pt-pt": "risco-por-setor",
    },
  },
  {
    id: "aspm-cost",
    internalSlug: "costo-de-no-usar-aspm",
    slugs: {
      "es-es": "costo-de-no-tener-aspm",
      "en-us": "aspm-roi",
      "en-eu": "aspm-roi",
      "pt-pt": "custo-sem-aspm",
    },
  },
  {
    id: "cra-compliance",
    internalSlug: "compliance-eu-cra",
    slugs: {
      "es-es": "cyber-resilience-act",
      "en-us": "cyber-resilience-act-readiness",
      "en-eu": "cyber-resilience-act",
      "pt-pt": "cyber-resilience-act",
    },
  },
  {
    id: "dora-compliance",
    internalSlug: "compliance-dora",
    slugs: {
      "es-es": "dora-riesgo-tic",
      "en-us": "dora-ict-risk",
      "en-eu": "dora-ict-risk",
      "pt-pt": "dora-risco-tic",
    },
  },
];

export const GUIDE_SLUGS = ["owasp-top-10-risk", "eu-cra-readiness", "dora-ict-resilience", "nis2-application-security"] as const;
export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export const GUIDE_SEO_SLUGS: Record<GuideSlug, Record<Region, string>> = {
  "owasp-top-10-risk": {
    "es-es": "riesgo-owasp-top-10",
    "en-us": "owasp-top-10-risk",
    "en-eu": "owasp-top-10-risk",
    "pt-pt": "risco-owasp-top-10",
  },
  "eu-cra-readiness": {
    "es-es": "cra-gestion-vulnerabilidades",
    "en-us": "eu-cra-readiness",
    "en-eu": "cra-vulnerability-handling",
    "pt-pt": "cra-gestao-vulnerabilidades",
  },
  "dora-ict-resilience": {
    "es-es": "dora-gestion-riesgos-tic",
    "en-us": "dora-ict-risk-management",
    "en-eu": "dora-ict-risk-management",
    "pt-pt": "dora-gestao-riscos-tic",
  },
  "nis2-application-security": {
    "es-es": "nis2-seguridad-aplicaciones",
    "en-us": "nis2-application-security",
    "en-eu": "nis2-application-security",
    "pt-pt": "nis2-seguranca-aplicacional",
  },
};

export function resolveCalculatorBySeoSlug(region: Region, seoSlug: string) {
  const route = CALCULATOR_SEO_ROUTES.find((r) => r.slugs[region] === seoSlug);
  return route ?? null;
}

export function resolveGuideBySeoSlug(region: Region, seoSlug: string): GuideSlug | null {
  const entry = Object.entries(GUIDE_SEO_SLUGS).find(([, slugs]) => slugs[region] === seoSlug);
  return entry ? (entry[0] as GuideSlug) : null;
}

export function calculatorSeoUrl(region: Region, internalSlug: string): string {
  const route = CALCULATOR_SEO_ROUTES.find((r) => r.internalSlug === internalSlug);
  if (!route) return absoluteUrl(`/calculadora/${internalSlug}`);
  return absoluteUrl(regionPath(region, calcSection(region), route.slugs[region]));
}

export function calculatorAlternates(internalSlug: string) {
  const route = CALCULATOR_SEO_ROUTES.find((r) => r.internalSlug === internalSlug);
  if (!route) return {};
  return Object.fromEntries(
    (Object.keys(route.slugs) as Region[]).map((region) => [
      REGION_HREFLANG[region],
      calculatorSeoUrl(region, internalSlug),
    ])
  );
}

export function allPublicSeoPaths(): string[] {
  const paths: string[] = ["/"];

  for (const region of ["es-es", "en-us", "en-eu", "pt-pt"] as Region[]) {
    paths.push(`/${region}`);
    paths.push(regionPath(region, calcSection(region)));
    paths.push(regionPath(region, guidesSection(region)));
    paths.push(regionPath(region, methodologySection(region)));

    for (const route of CALCULATOR_SEO_ROUTES) {
      paths.push(regionPath(region, calcSection(region), route.slugs[region]));
      paths.push(regionPath(region, methodologySection(region), route.slugs[region]));
    }

    for (const slug of GUIDE_SLUGS) {
      paths.push(regionPath(region, guidesSection(region), GUIDE_SEO_SLUGS[slug][region]));
    }
  }

  return paths;
}

export function isValidSeoSection(region: Region, section: string): section is SeoSection {
  const valid = [
    calcSection(region),
    guidesSection(region),
    methodologySection(region),
  ];
  return valid.includes(section as SeoSection);
}