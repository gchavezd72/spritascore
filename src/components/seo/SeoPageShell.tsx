import Link from "next/link";
import type { ReactNode } from "react";
import { FaqSection } from "@/components/seo/FaqSection";
import type { FaqItem } from "@/data/seoContent/types";
import { ORGANIZATION } from "@/lib/seo";

interface SeoPageShellProps {
  h1: string;
  summary: string;
  children: ReactNode;
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
  faqTitle = "Preguntas frecuentes",
  ctaHref = "/#calculadoras",
  ctaLabel = "Ejecutar calculadora",
  secondaryCtaHref = ORGANIZATION.url,
  secondaryCtaLabel = "Servicios Sprita iT",
}: SeoPageShellProps) {
  return (
    <article className="seo-page">
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <p className="seo-eyebrow">
          SpritaScore · marca de{" "}
          <a href={ORGANIZATION.url} target="_blank" rel="noopener noreferrer">
            Sprita iT
          </a>
        </p>
        <h1 className="seo-h1">{h1}</h1>
        <p className="seo-lead">{summary}</p>
        <div className="seo-cta-row">
          <Link href={ctaHref} className="btn btn-solid">
            {ctaLabel}
          </Link>
          <a href={secondaryCtaHref} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
            {secondaryCtaLabel} ↗
          </a>
        </div>
        <div className="seo-body">{children}</div>
        {faq && faq.length > 0 && <FaqSection title={faqTitle} items={faq} />}
      </div>
    </article>
  );
}