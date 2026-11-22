import Link from "next/link";
import type { ReactNode } from "react";
import { FaqSection } from "@/components/seo/FaqSection";
import type { FaqItem } from "@/data/seoContent/types";
import { ORGANIZATION } from "@/lib/seo";
import type { Locale } from "@/types/calculator";

const SHELL_COPY: Record<Locale, { brand: string; faq: string; cta: string; services: string }> = {
  es: {
    brand: "SpritaScore · marca de",
    faq: "Preguntas frecuentes",
    cta: "Ejecutar calculadora",
    services: "Servicios Sprita iT",
  },
  en: {
    brand: "SpritaScore · a brand of",
    faq: "Frequently asked questions",
    cta: "Run calculator",
    services: "Sprita iT services",
  },
  pt: {
    brand: "SpritaScore · uma marca da",
    faq: "Perguntas frequentes",
    cta: "Executar calculadora",
    services: "Serviços Sprita iT",
  },
};

interface SeoPageShellProps {
  h1: string;
  summary: string;
  children: ReactNode;
  locale?: Locale;
  faq?: FaqItem[];
  faqTitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryCtaHref?: string;
  secondaryCtaLabel?: string;
}

export function SeoPageShell({
  h1,
  summary,
  children,
  faq,
  locale = "es",
  faqTitle,
  ctaHref = "/#calculadoras",
  ctaLabel,
  secondaryCtaHref = ORGANIZATION.url,
  secondaryCtaLabel,
}: SeoPageShellProps) {
  const shell = SHELL_COPY[locale];
  return (
    <article className="seo-page">
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <p className="seo-eyebrow">
          {shell.brand}{" "}
          <a href={ORGANIZATION.url} target="_blank" rel="noopener noreferrer">
            Sprita iT
          </a>
        </p>
        <h1 className="seo-h1">{h1}</h1>
        <p className="seo-lead">{summary}</p>
        <div className="seo-cta-row">
          <Link href={ctaHref} className="btn btn-solid">
            {ctaLabel ?? shell.cta}
          </Link>
          <a href={secondaryCtaHref} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
            {secondaryCtaLabel ?? shell.services} ↗
          </a>
        </div>
        <div className="seo-body">{children}</div>
        {faq && faq.length > 0 && <FaqSection title={faqTitle ?? shell.faq} items={faq} />}
      </div>
    </article>
  );
}