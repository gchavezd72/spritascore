import Link from "next/link";
import { getCalculatorBySlug } from "@/data/calculatorConfigs";
import { getCalculatorSeoContent } from "@/data/seoContent/calculatorPages";
import { CalculatorWizard } from "@/components/CalculatorWizard";
import { CalculatorPageHeader } from "@/components/CalculatorPageHeader";
import { FaqSection } from "@/components/seo/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import {
  calculatorAlternates,
  CALCULATOR_SEO_ROUTES,
  GUIDE_SEO_SLUGS,
  type GuideSlug,
} from "@/lib/seoRoutes";
import { calculatorJsonLd, buildPageMetadata } from "@/lib/seo";
import {
  REGION_LOCALE,
  calcSection,
  guidesSection,
  marketForRegion,
  methodologySection,
  regionPath,
  type Region,
} from "@/lib/regions";
import { ORGANIZATION } from "@/lib/seo";

interface CalculatorSeoLandingProps {
  region: Region;
  internalSlug: string;
}

const FAQ_TITLE = { es: "Preguntas frecuentes", en: "Frequently asked questions", pt: "Perguntas frequentes" };
const SECTION_TITLE = {
  measures: { es: "Qué mide esta calculadora", en: "What this calculator measures", pt: "O que esta calculadora mede" },
  inputs: { es: "Entradas del modelo", en: "Model inputs", pt: "Entradas do modelo" },
  how: { es: "Cómo funciona la estimación", en: "How the estimate works", pt: "Como funciona a estimativa" },
  example: { es: "Ejemplo por industria", en: "Industry example", pt: "Exemplo por setor" },
  score: { es: "Qué significa el score", en: "What the score means", pt: "O que significa o score" },
  limits: { es: "Limitaciones", en: "Limitations", pt: "Limitações" },
  related: { es: "Guías relacionadas", en: "Related guides", pt: "Guias relacionadas" },
  methodology: { es: "Metodología", en: "Methodology", pt: "Metodologia" },
  run: { es: "Ejecutar calculadora", en: "Run calculator", pt: "Executar calculadora" },
};

export function getCalculatorSeoPageMetadata(region: Region, internalSlug: string) {
  const locale = REGION_LOCALE[region];
  const content = getCalculatorSeoContent(internalSlug, locale, marketForRegion(region));
  const route = CALCULATOR_SEO_ROUTES.find((r) => r.internalSlug === internalSlug);
  if (!content || !route) return {};
  return buildPageMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: regionPath(region, calcSection(region), route.slugs[region]),
    keywords: content.h1.split(" ").slice(0, 8),
    hreflangAlternates: calculatorAlternates(internalSlug),
  });
}

export function CalculatorSeoLanding({ region, internalSlug }: CalculatorSeoLandingProps) {
  const locale = REGION_LOCALE[region];
  const market = marketForRegion(region);
  const content = getCalculatorSeoContent(internalSlug, locale, market);
  const config = getCalculatorBySlug(internalSlug);
  const route = CALCULATOR_SEO_ROUTES.find((r) => r.internalSlug === internalSlug);

  if (!content || !config || !route) return null;

  const seoSlug = route.slugs[region];
  const st = (key: keyof typeof SECTION_TITLE) => SECTION_TITLE[key][locale];

  return (
    <>
      <JsonLd data={calculatorJsonLd(config)} />
      <article className="seo-page">
        <div className="container mx-auto px-4 max-w-4xl pt-10 pb-4">
          <p className="seo-eyebrow">
            SpritaScore ·{" "}
            <a href={ORGANIZATION.url} target="_blank" rel="noopener noreferrer">
              Sprita iT
            </a>
          </p>
          <h1 className="seo-h1">{content.h1}</h1>
          <p className="seo-lead">{content.shortAnswer}</p>
          <div className="seo-cta-row">
            <a href="#calculadora" className="btn btn-solid">
              {st("run")}
            </a>
            <Link href={regionPath(region, methodologySection(region), seoSlug)} className="btn btn-ghost">
              {st("methodology")}
            </Link>
          </div>
        </div>

        <section className="seo-static">
          <div className="container mx-auto px-4 max-w-4xl space-y-10 pb-10">
            <section>
              <h2 className="seo-h2">{st("measures")}</h2>
              <ul className="seo-list">
                {content.measures.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="seo-h2">{st("inputs")}</h2>
              <ul className="seo-list">
                {content.inputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="seo-h2">{st("how")}</h2>
              {content.howItWorks.map((p) => (
                <p key={p} className="seo-p">{p}</p>
              ))}
            </section>
            <section>
              <h2 className="seo-h2">{st("example")}</h2>
              <p className="seo-p">{content.example}</p>
            </section>
            <section>
              <h2 className="seo-h2">{st("score")}</h2>
              <ul className="seo-list">
                {content.scoreMeaning.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="seo-h2">{st("limits")}</h2>
              <ul className="seo-list">
                {content.limitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            {content.relatedGuideSlugs.length > 0 && (
              <section>
                <h2 className="seo-h2">{st("related")}</h2>
                <ul className="seo-links">
                  {content.relatedGuideSlugs.map((guideSlug: GuideSlug) => (
                    <li key={guideSlug}>
                      <Link href={regionPath(region, guidesSection(region), GUIDE_SEO_SLUGS[guideSlug][region])}>
                        {GUIDE_SEO_SLUGS[guideSlug][region].replace(/-/g, " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </section>

        <section id="calculadora" className="py-12 bg-background border-t border-border-hairline">
          <div className="container mx-auto px-4">
            <CalculatorPageHeader config={config} />
            <CalculatorWizard config={config} />
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-4xl pb-16">
          <FaqSection title={FAQ_TITLE[locale]} items={content.faq} />
        </div>
      </article>
    </>
  );
}