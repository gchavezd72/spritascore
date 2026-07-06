import type { Metadata } from "next";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import type { CalculatorConfig } from "@/types/calculator";
import { tr } from "@/lib/translate";

export const SITE_URL = "https://spritascore.com";
export const SITE_NAME = "SpritaScore";
export const SITE_TAGLINE =
  "Application Risk & Cost Calculator — seguridad de aplicaciones, DevSecOps y ASPM";

export const ORGANIZATION = {
  name: "Sprita IT",
  legalName: "Sprita IT",
  url: "https://sprita-it.com",
  email: "info@spritascore.com",
  contactEmail: "info@sprita-it.com",
  logo: `${SITE_URL}/globe.svg`,
  sameAs: ["https://sprita-it.com"],
} as const;

const DEFAULT_DESCRIPTION = {
  es: "Convierte el riesgo técnico en impacto financiero. Calculadoras de costo y compliance para vulnerabilidades OWASP, deuda técnica ISO 25010, EU Cyber Resilience Act, DORA, ASPM y riesgo por sector. Disponible en español, inglés y portugués.",
  en: "Turn technical risk into financial impact. Cost and compliance calculators for OWASP vulnerabilities, ISO 25010 technical debt, EU Cyber Resilience Act, DORA, ASPM, and sector risk. Available in Spanish, English, and Portuguese.",
  pt: "Converta risco técnico em impacto financeiro. Calculadoras de custo e compliance para vulnerabilidades OWASP, dívida técnica ISO 25010, EU Cyber Resilience Act, DORA, ASPM e risco por setor. Disponível em espanhol, inglês e português.",
};

const DEFAULT_KEYWORDS = [
  "SpritaScore",
  "Sprita IT",
  "seguridad de aplicaciones",
  "application security",
  "DevSecOps",
  "ASPM",
  "calculadora de riesgo software",
  "software risk calculator",
  "OWASP Top 10",
  "OWASP Mobile Top 10",
  "ISO 25010",
  "deuda técnica",
  "technical debt cost",
  "EU Cyber Resilience Act",
  "CRA compliance",
  "DORA",
  "Digital Operational Resilience Act",
  "resiliencia operativa digital",
  "SBOM",
  "SAST",
  "DAST",
  "SCA",
  "gestión de vulnerabilidades",
  "vulnerability cost",
  "compliance financiero",
  "risk score",
];

export const CALCULATOR_SEO: Record<
  string,
  { title: { es: string; en: string; pt: string }; keywords: string[] }
> = {
  "no-calidad-codigo": {
    title: {
      es: "Calculadora de costo de deuda técnica y no calidad ISO 25010",
      en: "ISO 25010 technical debt and poor quality cost calculator",
      pt: "Calculadora de custo de dívida técnica e má qualidade ISO 25010",
    },
    keywords: ["ISO 25010", "deuda técnica", "code quality cost", "maintainability"],
  },
  "owasp-top10-web": {
    title: {
      es: "Calculadora de costo de vulnerabilidad OWASP Top 10 web",
      en: "OWASP Top 10 web vulnerability cost calculator",
      pt: "Calculadora de custo de vulnerabilidade OWASP Top 10 web",
    },
    keywords: ["OWASP Top 10", "web vulnerability", "security cost"],
  },
  "owasp-mobile-top10": {
    title: {
      es: "Calculadora de vulnerabilidades OWASP Mobile Top 10",
      en: "OWASP Mobile Top 10 vulnerability calculator",
      pt: "Calculadora de vulnerabilidades OWASP Mobile Top 10",
    },
    keywords: ["OWASP Mobile", "mobile app security", "app vulnerability cost"],
  },
  "riesgo-por-sector": {
    title: {
      es: "Calculadora de riesgo y costo por sector industrial",
      en: "Industrial sector risk and cost calculator",
      pt: "Calculadora de risco e custo por setor industrial",
    },
    keywords: ["sector risk", "industry cybersecurity", "financial impact"],
  },
  "costo-de-no-usar-aspm": {
    title: {
      es: "Calculadora del costo de no tener un ASPM",
      en: "Cost of not having an ASPM calculator",
      pt: "Calculadora do custo de não ter um ASPM",
    },
    keywords: ["ASPM", "AppSec", "security tool sprawl", "alert triage cost"],
  },
  "compliance-eu-cra": {
    title: {
      es: "Evaluación de compliance con el EU Cyber Resilience Act",
      en: "EU Cyber Resilience Act compliance assessment",
      pt: "Avaliação de conformidade com o EU Cyber Resilience Act",
    },
    keywords: ["EU CRA", "Cyber Resilience Act", "SBOM", "product security"],
  },
  "compliance-dora": {
    title: {
      es: "Evaluación de cumplimiento con DORA",
      en: "DORA compliance assessment",
      pt: "Avaliação de conformidade com o DORA",
    },
    keywords: ["DORA", "Digital Operational Resilience Act", "financial sector ICT", "operational resilience"],
  },
};

export function absoluteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

export function siteAlternates(path = "") {
  const url = absoluteUrl(path);
  return {
    canonical: url,
    languages: {
      es: url,
      en: url,
      pt: url,
      "x-default": url,
    },
  };
}

interface PageMetadataInput {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
}

export function buildPageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  type = "website",
  hreflangAlternates,
}: PageMetadataInput & { hreflangAlternates?: Record<string, string> }): Metadata {
  const url = absoluteUrl(path);
  const allKeywords = [...new Set([...DEFAULT_KEYWORDS, ...keywords])];
  const languages = hreflangAlternates
    ? { ...hreflangAlternates, "x-default": hreflangAlternates["es-es"] ?? url }
    : siteAlternates(path).languages;

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "es_ES",
      alternateLocale: ["en_US", "pt_BR"],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "technology",
  };
}

export const rootMetadata: Metadata = buildPageMetadata({
  title: "SpritaScore — Calculadora de riesgo y costo de software | DevSecOps y ASPM",
  description: DEFAULT_DESCRIPTION.es,
  path: "",
});

export function calculatorMetadata(slug: string): Metadata {
  const config = CALCULATOR_CONFIGS.find((c) => c.slug === slug);
  if (!config) {
    return { title: "Calculadora no encontrada" };
  }

  const seo = CALCULATOR_SEO[slug];
  const title = seo?.title.es ?? tr(config.title, "es");
  const description = tr(config.shortDescription, "es");

  return buildPageMetadata({
    title,
    description,
    path: `/calculadora/${slug}`,
    keywords: seo?.keywords ?? [],
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    email: ORGANIZATION.email,
    sameAs: ORGANIZATION.sameAs,
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION.es,
    inLanguage: ["es", "en", "pt"],
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/#calculadoras`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: DEFAULT_DESCRIPTION.es,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: CALCULATOR_CONFIGS.map((c) => tr(c.title, "es")),
    inLanguage: ["es", "en", "pt"],
    provider: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
  };
}

export function faqJsonLd() {
  const faqs = [
    {
      q: "¿Qué es SpritaScore?",
      a: "SpritaScore es una plataforma B2B de calculadoras que convierte riesgos técnicos de software — vulnerabilidades, deuda técnica y brechas de compliance — en impacto financiero ejecutivo. Es un producto de Sprita IT.",
    },
    {
      q: "¿Qué calculadoras incluye SpritaScore?",
      a: `Incluye ${CALCULATOR_CONFIGS.length} calculadoras: costo de no calidad ISO 25010, OWASP Top 10 web, OWASP Mobile Top 10, riesgo por sector, costo de no tener ASPM, compliance EU CRA y evaluación DORA.`,
    },
    {
      q: "¿SpritaScore está disponible en varios idiomas?",
      a: "Sí. La interfaz, calculadoras y reportes están disponibles en español, inglés y portugués.",
    },
    {
      q: "¿Los resultados de SpritaScore son una auditoría formal?",
      a: "No. Los resultados son estimaciones orientativas basadas en la información ingresada. No constituyen auditoría, certificación ni opinión legal.",
    },
    {
      q: "¿Quién desarrolla SpritaScore?",
      a: "SpritaScore es desarrollado por Sprita IT (sprita-it.com), empresa especializada en seguridad de aplicaciones, DevSecOps, SAST, DAST, SCA y calidad de código.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function calculatorJsonLd(config: CalculatorConfig) {
  const seo = CALCULATOR_SEO[config.slug];
  const path = `/calculadora/${config.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: seo?.title.es ?? tr(config.title, "es"),
      description: tr(config.shortDescription, "es"),
      url: absoluteUrl(path),
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: {
        "@type": "Organization",
        name: ORGANIZATION.name,
        url: ORGANIZATION.url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "SpritaScore",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Calculadoras",
          item: `${SITE_URL}/#calculadoras`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tr(config.title, "es"),
          item: absoluteUrl(path),
        },
      ],
    },
  ];
}

export function privacyMetadata(): Metadata {
  return buildPageMetadata({
    title: "Política de privacidad",
    description:
      "Política de privacidad de SpritaScore: cómo tratamos datos de contacto, resultados de calculadoras y cookies propias.",
    path: "/privacidad",
    keywords: ["privacidad", "privacy policy", "cookies", "GDPR"],
  });
}