import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { getCalculatorSeoContent } from "@/data/seoContent/calculatorPages";
import { getGuideContentForRegion } from "@/data/seoContent/guides";
import {
  CALCULATOR_SEO_ROUTES,
  GUIDE_SEO_SLUGS,
  GUIDE_SLUGS,
  isValidSeoSection,
} from "@/lib/seoRoutes";
import {
  calcSection,
  guidesSection,
  isRegion,
  marketForRegion,
  methodologySection,
  REGION_LOCALE,
  regionPath,
  type Region,
} from "@/lib/regions";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ region: string; section: string }>;
}

const COPY = {
  es: {
    calculators: {
      h1: "Calculadoras",
      summary: "Estimaciones de riesgo y costo a partir de respuestas declaradas. No escanean código.",
    },
    guides: {
      h1: "Guías",
      summary: "Contexto para leer una estimación. Una guía no sustituye el resultado de la calculadora ni una auditoría.",
    },
    methodology: {
      h1: "Metodología",
      summary: "Qué entra en cada modelo, qué sale y qué no afirma. El detalle vive junto a cada calculadora.",
    },
  },
  en: {
    calculators: {
      h1: "Calculators",
      summary: "Risk and cost estimates from declared answers. They do not scan code.",
    },
    guides: {
      h1: "Guides",
      summary: "Context for reading an estimate. A guide does not replace the calculator result or an audit.",
    },
    methodology: {
      h1: "Methodology",
      summary: "What each model takes in, what it returns, and what it does not claim.",
    },
  },
  pt: {
    calculators: {
      h1: "Calculadoras",
      summary: "Estimativas de risco e custo a partir de respostas declaradas. Não analisam código.",
    },
    guides: {
      h1: "Guias",
      summary: "Contexto para ler uma estimativa. Um guia não substitui o resultado da calculadora nem uma auditoria.",
    },
    methodology: {
      h1: "Metodologia",
      summary: "O que entra em cada modelo, o que sai e o que ele não afirma.",
    },
  },
} as const;

function sectionKind(region: Region, section: string): "calculators" | "guides" | "methodology" | null {
  if (section === calcSection(region)) return "calculators";
  if (section === guidesSection(region)) return "guides";
  if (section === methodologySection(region)) return "methodology";
  return null;
}

export function generateStaticParams() {
  const regions: Region[] = ["es-es", "en-us", "en-eu", "pt-pt"];
  return regions.flatMap((region) => [
    { region, section: calcSection(region) },
    { region, section: guidesSection(region) },
    { region, section: methodologySection(region) },
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: r, section } = await params;
  if (!isRegion(r) || !isValidSeoSection(r, section)) return {};
  const region = r;
  const kind = sectionKind(region, section);
  if (!kind) return {};
  const copy = COPY[REGION_LOCALE[region]][kind];
  return buildPageMetadata({
    title: copy.h1,
    description: copy.summary,
    path: regionPath(region, section),
    locale: REGION_LOCALE[region],
  });
}

export default async function RegionalSectionIndex({ params }: PageProps) {
  const { region: r, section } = await params;
  if (!isRegion(r) || !isValidSeoSection(r, section)) notFound();
  const region = r;
  const kind = sectionKind(region, section);
  if (!kind) notFound();

  const locale = REGION_LOCALE[region];
  const market = marketForRegion(region);
  const copy = COPY[locale][kind];

  const items =
    kind === "guides"
      ? GUIDE_SLUGS.map((slug) => {
          const content = getGuideContentForRegion(slug, region);
          return {
            href: regionPath(region, section, GUIDE_SEO_SLUGS[slug][region]),
            label: content?.h1 ?? GUIDE_SEO_SLUGS[slug][region],
          };
        })
      : CALCULATOR_SEO_ROUTES.map((route) => {
          const content = getCalculatorSeoContent(route.internalSlug, locale, market);
          const prefix = kind === "methodology" ? (locale === "en" ? "Methodology: " : locale === "pt" ? "Metodologia: " : "Metodología: ") : "";
          return {
            href: regionPath(region, section, route.slugs[region]),
            label: content ? `${prefix}${content.h1}` : route.slugs[region],
          };
        });

  return (
    <SeoPageShell locale={locale} h1={copy.h1} summary={copy.summary} ctaHref={`/${region}`} ctaLabel={locale === "en" ? "Back to the regional page" : locale === "pt" ? "Voltar à página regional" : "Volver a la página regional"}>
      <ul className="seo-links">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </SeoPageShell>
  );
}
