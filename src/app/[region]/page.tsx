import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegionalHomeContent } from "@/data/seoContent/regionalHome";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import {
  CALCULATOR_SEO_ROUTES,
  GUIDE_SEO_SLUGS,
  GUIDE_SLUGS,
} from "@/lib/seoRoutes";
import {
  calcSection,
  guidesSection,
  isRegion,
  methodologySection,
  regionPath,
  type Region,
} from "@/lib/regions";
import { buildPageMetadata, ORGANIZATION } from "@/lib/seo";

interface PageProps {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return [{ region: "es-es" }, { region: "en-us" }, { region: "en-eu" }, { region: "pt-pt" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: r } = await params;
  if (!isRegion(r)) return {};
  const content = getRegionalHomeContent(r as Region);
  return buildPageMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: `/${r}`,
  });
}

export default async function RegionalHomePage({ params }: PageProps) {
  const { region: r } = await params;
  if (!isRegion(r)) notFound();
  const region = r as Region;
  const content = getRegionalHomeContent(region);

  return (
    <article className="seo-page">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: content.h1,
          description: content.metaDescription,
          publisher: { "@type": "Organization", name: ORGANIZATION.name, url: ORGANIZATION.url },
        }}
      />
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <p className="seo-eyebrow">
          SpritaScore · marca de{" "}
          <a href={ORGANIZATION.url} target="_blank" rel="noopener noreferrer">
            Sprita iT
          </a>
        </p>
        <h1 className="seo-h1">{content.h1}</h1>
        {content.intro.map((p) => (
          <p key={p} className="seo-p">{p}</p>
        ))}
        <div className="seo-value-grid">
          {content.valueProps.map((vp) => (
            <div key={vp.title} className="seo-value-card">
              <h3>{vp.title}</h3>
              <p>{vp.body}</p>
            </div>
          ))}
        </div>
        <h2 className="seo-h2">Calculadoras</h2>
        <ul className="seo-links">
          {CALCULATOR_SEO_ROUTES.map((route) => (
            <li key={route.internalSlug}>
              <Link href={regionPath(region, calcSection(region), route.slugs[region])}>
                {route.slugs[region].replace(/-/g, " ")}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="seo-h2">Guías</h2>
        <ul className="seo-links">
          {GUIDE_SLUGS.map((slug) => (
            <li key={slug}>
              <Link href={regionPath(region, guidesSection(region), GUIDE_SEO_SLUGS[slug][region])}>
                {GUIDE_SEO_SLUGS[slug][region].replace(/-/g, " ")}
              </Link>
            </li>
          ))}
        </ul>
        <p className="seo-p">
          <Link href={regionPath(region, methodologySection(region))}>Metodología</Link>
          {" · "}
          <Link href="/">Versión interactiva completa</Link>
        </p>
        <FaqSection title="FAQ" items={content.faq} />
      </div>
    </article>
  );
}