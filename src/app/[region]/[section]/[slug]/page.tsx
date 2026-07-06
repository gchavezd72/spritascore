import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalculatorSeoLanding,
  getCalculatorSeoPageMetadata,
} from "@/components/seo/CalculatorSeoLanding";
import { SeoPageShell } from "@/components/seo/SeoPageShell";
import { getMethodologyContent } from "@/data/seoContent/methodology";
import { getGuideContentForRegion } from "@/data/seoContent/guides";
import {
  resolveCalculatorBySeoSlug,
  resolveGuideBySeoSlug,
  GUIDE_SEO_SLUGS,
  type GuideSlug,
} from "@/lib/seoRoutes";
import {
  calcSection,
  guidesSection,
  isRegion,
  methodologySection,
  REGION_LOCALE,
  marketForRegion,
  regionPath,
  type Region,
} from "@/lib/regions";
import { isValidSeoSection } from "@/lib/seoRoutes";
import { buildPageMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ region: string; section: string; slug: string }>;
}

export async function generateStaticParams() {
  const regions: Region[] = ["es-es", "en-us", "en-eu", "pt-pt"];
  const paths: { region: string; section: string; slug: string }[] = [];

  for (const region of regions) {
    const { CALCULATOR_SEO_ROUTES } = await import("@/lib/seoRoutes");
    for (const route of CALCULATOR_SEO_ROUTES) {
      paths.push({ region, section: calcSection(region), slug: route.slugs[region] });
      paths.push({ region, section: methodologySection(region), slug: route.slugs[region] });
    }
    const { GUIDE_SLUGS } = await import("@/lib/seoRoutes");
    for (const guide of GUIDE_SLUGS) {
      paths.push({ region, section: guidesSection(region), slug: GUIDE_SEO_SLUGS[guide][region] });
    }
  }

  return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: r, section, slug } = await params;
  if (!isRegion(r) || !isValidSeoSection(r as Region, section)) return {};

  const region = r as Region;

  if (section === calcSection(region)) {
    const resolved = resolveCalculatorBySeoSlug(region, slug);
    if (!resolved) return {};
    return getCalculatorSeoPageMetadata(region, resolved.internalSlug);
  }

  if (section === methodologySection(region)) {
    const resolved = resolveCalculatorBySeoSlug(region, slug);
    if (!resolved) return {};
    const content = getMethodologyContent(
      resolved.internalSlug,
      REGION_LOCALE[region],
      marketForRegion(region)
    );
    if (!content) return {};
    return buildPageMetadata({
      title: content.metaTitle,
      description: content.metaDescription,
      path: regionPath(region, section, slug),
    });
  }

  const guideSlug = resolveGuideBySeoSlug(region, slug);
  if (!guideSlug) return {};
  const content = getGuideContentForRegion(guideSlug, region);
  if (!content) return {};
  return buildPageMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: regionPath(region, section, slug),
  });
}

export default async function RegionalSeoPage({ params }: PageProps) {
  const { region: r, section, slug } = await params;
  if (!isRegion(r) || !isValidSeoSection(r as Region, section)) notFound();

  const region = r as Region;

  if (section === calcSection(region)) {
    const resolved = resolveCalculatorBySeoSlug(region, slug);
    if (!resolved) notFound();
    return <CalculatorSeoLanding region={region} internalSlug={resolved.internalSlug} />;
  }

  if (section === methodologySection(region)) {
    const resolved = resolveCalculatorBySeoSlug(region, slug);
    if (!resolved) notFound();
    const content = getMethodologyContent(
      resolved.internalSlug,
      REGION_LOCALE[region],
      marketForRegion(region)
    );
    if (!content) notFound();

    return (
      <SeoPageShell
        h1={content.h1}
        summary={content.overview[0]}
        ctaHref={regionPath(region, calcSection(region), slug) + "#calculadora"}
        ctaLabel={REGION_LOCALE[region] === "es" ? "Ir a la calculadora" : REGION_LOCALE[region] === "pt" ? "Ir à calculadora" : "Go to calculator"}
        faq={content.faq}
      >
        {content.overview.map((p) => (
          <p key={p} className="seo-p">{p}</p>
        ))}
        <h2 className="seo-h2">Factores</h2>
        <ul className="seo-list">{content.factors.map((f) => <li key={f}>{f}</li>)}</ul>
        <h2 className="seo-h2">Salidas</h2>
        <ul className="seo-list">{content.outputs.map((o) => <li key={o}>{o}</li>)}</ul>
        <h2 className="seo-h2">Limitaciones</h2>
        <ul className="seo-list">{content.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
        <p className="seo-p">
          <Link href={regionPath(region, calcSection(region), slug)}>← Calculadora</Link>
        </p>
      </SeoPageShell>
    );
  }

  const guideSlug = resolveGuideBySeoSlug(region, slug);
  if (!guideSlug) notFound();
  const content = getGuideContentForRegion(guideSlug, region);
  if (!content) notFound();

  return (
    <SeoPageShell
      h1={content.h1}
      summary={content.summary}
      ctaHref="/#calculadoras"
      faq={content.faq}
    >
      {content.sections.map((sec) => (
        <section key={sec.heading}>
          <h2 className="seo-h2">{sec.heading}</h2>
          {sec.paragraphs.map((p) => (
            <p key={p} className="seo-p">{p}</p>
          ))}
        </section>
      ))}
      <h2 className="seo-h2">Referencias</h2>
      <ul className="seo-links">
        {content.references.map((ref) => (
          <li key={ref.url}>
            <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.label}</a>
          </li>
        ))}
      </ul>
    </SeoPageShell>
  );
}