import type { Metadata } from "next";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import type { CalculatorConfig, Locale } from "@/types/calculator";
import { tr } from "@/lib/translate";

export const SITE_URL = "https://spritascore.com";
export const SITE_NAME = "SpritaScore";
export const SITE_TAGLINE =
  "Application Risk & Cost Calculator — seguridad de aplicaciones, DevSecOps y ASPM";

export const ORGANIZATION = {
  name: "Sprita IT",
  legalName: "Sprita IT",
  url: "https://sprita-it.com",
  email: "info@sprita-it.com",
  contactEmail: "info@sprita-it.com",
  logo: `${SITE_URL}/spritascore-icon.svg`,
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

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
};

function openGraphLocales(locale?: Locale): { locale: string; alternateLocale: string[] } {
  if (!locale) return { locale: "es_ES", alternateLocale: ["en_US", "pt_BR"] };
  return {
    locale: OG_LOCALE[locale],
    alternateLocale: (["en", "es", "pt"] as const)
      .filter((item) => item !== locale)
      .map((item) => OG_LOCALE[item]),
  };
}

const CATALOG_LABEL: Record<Locale, string> = {
  en: "Calculators",
  es: "Calculadoras",
  pt: "Calculadoras",
};

const NOT_FOUND_TITLE: Record<Locale, string> = {
  en: "Calculator not found",
  es: "Calculadora no encontrada",
  pt: "Calculadora não encontrada",
};

interface PageMetadataInput {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  /** Sets Open Graph locale. Omitted pages keep the previous es_ES default. */
  locale?: Locale;
}

export function buildPageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  type = "website",
  locale,
  hreflangAlternates,
}: PageMetadataInput & { hreflangAlternates?: Record<string, string> }): Metadata {
  const url = absoluteUrl(path);
  const allKeywords = [...new Set([...DEFAULT_KEYWORDS, ...keywords])];
  const languages = hreflangAlternates
    ? { ...hreflangAlternates, "x-default": hreflangAlternates["es-es"] ?? url }
    : siteAlternates(path).languages;
  const og = openGraphLocales(locale);

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
      locale: og.locale,
      alternateLocale: og.alternateLocale,
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

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const HOME_OG = {
  title: "SpritaScore | Turn Software Risk into Financial Impact",
  description:
    "Nine free calculators that turn software risk into financial impact: code quality, OWASP, EU AI Act, DORA and CRA readiness. Your score in 5 minutes.",
  image: `${SITE_URL}/og-image.png`,
  url: SITE_URL,
} as const;

const HOME_TITLE: Record<Locale, string> = {
  en: "SpritaScore — Software risk and cost calculator | DevSecOps and ASPM",
  es: "SpritaScore — Calculadora de riesgo y costo de software | DevSecOps y ASPM",
  pt: "SpritaScore — Calculadora de risco e custo de software | DevSecOps e ASPM",
};

export const DEFAULT_TITLE = HOME_TITLE.en;

export function homeMetadata(locale: Locale): Metadata {
  const title = HOME_TITLE[locale];
  const description = DEFAULT_DESCRIPTION[locale];
  const socialTitle = locale === "en" ? HOME_OG.title : title;
  const socialDescription = locale === "en" ? HOME_OG.description : description;
  const og = openGraphLocales(locale);

  return {
    ...buildPageMetadata({
      title,
      description,
      path: "",
      locale,
    }),
    title: {
      default: title,
      template: "%s | SpritaScore",
    },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: HOME_OG.url,
      siteName: SITE_NAME,
      locale: og.locale,
      alternateLocale: og.alternateLocale,
      type: "website",
      images: [
        {
          url: HOME_OG.image,
          width: 1200,
          height: 630,
          alt: socialTitle,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      images: [HOME_OG.image],
    },
    ...(googleSiteVerification
      ? { verification: { google: googleSiteVerification } }
      : {}),
  };
}

export const rootMetadata: Metadata = homeMetadata("en");

export function calculatorMetadata(slug: string, locale: Locale = "en"): Metadata {
  const config = CALCULATOR_CONFIGS.find((c) => c.slug === slug);
  if (!config) {
    return { title: NOT_FOUND_TITLE[locale] };
  }

  const seo = CALCULATOR_SEO[slug];
  const title = seo?.title[locale] ?? tr(config.title, locale);
  const description = tr(config.shortDescription, locale);

  return buildPageMetadata({
    title,
    description,
    path: `/calculadora/${slug}`,
    keywords: seo?.keywords ?? [],
    locale,
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

export function webSiteJsonLd(locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION[locale],
    inLanguage: ["en", "es", "pt"],
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
  };
}

export function webApplicationJsonLd(locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: DEFAULT_DESCRIPTION[locale],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: CALCULATOR_CONFIGS.map((c) => tr(c.title, locale)),
    inLanguage: ["en", "es", "pt"],
    provider: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
  };
}

export function faqJsonLd(locale: Locale = "en") {
  const names = CALCULATOR_CONFIGS.map((c) => tr(c.title, locale)).join(", ");
  const count = CALCULATOR_CONFIGS.length;
  const faqs = {
    en: [
      {
        q: "What is SpritaScore?",
        a: "SpritaScore is a B2B calculator platform that turns software technical risks — vulnerabilities, technical debt, and compliance gaps — into executive financial impact. It is a product of Sprita IT.",
      },
      {
        q: "Which calculators does SpritaScore include?",
        a: `It includes ${count} calculators: ${names}.`,
      },
      {
        q: "Is SpritaScore available in more than one language?",
        a: "Yes. The interface, calculators, and reports are available in English, Spanish, and Portuguese.",
      },
      {
        q: "Are SpritaScore results a formal audit?",
        a: "No. Results are indicative estimates based on the information you enter. They are not an audit, a certification, or legal advice.",
      },
      {
        q: "Who builds SpritaScore?",
        a: "SpritaScore is built by Sprita IT (sprita-it.com), a company focused on application security, DevSecOps, SAST, DAST, SCA, and code quality.",
      },
    ],
    es: [
      {
        q: "¿Qué es SpritaScore?",
        a: "SpritaScore es una plataforma B2B de calculadoras que convierte riesgos técnicos de software — vulnerabilidades, deuda técnica y brechas de compliance — en impacto financiero ejecutivo. Es un producto de Sprita IT.",
      },
      {
        q: "¿Qué calculadoras incluye SpritaScore?",
        a: `Incluye ${count} calculadoras: ${names}.`,
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
    ],
    pt: [
      {
        q: "O que é o SpritaScore?",
        a: "O SpritaScore é uma plataforma B2B de calculadoras que converte riscos técnicos de software — vulnerabilidades, dívida técnica e lacunas de compliance — em impacto financeiro executivo. É um produto da Sprita IT.",
      },
      {
        q: "Quais calculadoras o SpritaScore inclui?",
        a: `Inclui ${count} calculadoras: ${names}.`,
      },
      {
        q: "O SpritaScore está disponível em vários idiomas?",
        a: "Sim. A interface, as calculadoras e os relatórios estão disponíveis em inglês, espanhol e português.",
      },
      {
        q: "Os resultados do SpritaScore são uma auditoria formal?",
        a: "Não. Os resultados são estimativas indicativas com base na informação introduzida. Não constituem auditoria, certificação nem opinião legal.",
      },
      {
        q: "Quem desenvolve o SpritaScore?",
        a: "O SpritaScore é desenvolvido pela Sprita IT (sprita-it.com), empresa especializada em segurança de aplicações, DevSecOps, SAST, DAST, SCA e qualidade de código.",
      },
    ],
  }[locale];

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

export function calculatorJsonLd(config: CalculatorConfig, locale: Locale = "en") {
  const seo = CALCULATOR_SEO[config.slug];
  const path = `/calculadora/${config.slug}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: seo?.title[locale] ?? tr(config.title, locale),
      description: tr(config.shortDescription, locale),
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
          name: CATALOG_LABEL[locale],
          item: `${SITE_URL}/#calculadoras`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: tr(config.title, locale),
          item: absoluteUrl(path),
        },
      ],
    },
  ];
}

const PRIVACY_META: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Privacy policy",
    description:
      "SpritaScore privacy policy: how we handle contact data, calculator results, and our own cookies.",
  },
  es: {
    title: "Política de privacidad",
    description:
      "Política de privacidad de SpritaScore: cómo tratamos datos de contacto, resultados de calculadoras y cookies propias.",
  },
  pt: {
    title: "Política de privacidade",
    description:
      "Política de privacidade do SpritaScore: como tratamos dados de contacto, resultados das calculadoras e cookies próprios.",
  },
};

export function privacyMetadata(locale: Locale = "en"): Metadata {
  const copy = PRIVACY_META[locale];
  return buildPageMetadata({
    title: copy.title,
    description: copy.description,
    path: "/privacidad",
    keywords: ["privacidad", "privacy policy", "cookies", "GDPR"],
    locale,
  });
}