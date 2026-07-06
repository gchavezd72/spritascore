import Link from "next/link";
import { ExecutiveSoftwareRiskCalculator } from "@/components/executive/ExecutiveSoftwareRiskCalculator";
import { ExecutiveLanguageBar } from "@/components/executive/ExecutiveLanguageBar";
import { ExecutiveLocaleSync } from "@/components/executive/ExecutiveLocaleSync";
import { JsonLd } from "@/components/JsonLd";
import { getExecutiveCopy, EXECUTIVE_ROUTES } from "@/i18n/executive";
import { ORGANIZATION, SITE_URL } from "@/lib/seo";
import type { Locale } from "@/types/calculator";

interface ExecutiveSoftwareRiskPageProps {
  locale: Locale;
}

export function ExecutiveSoftwareRiskPage({ locale }: ExecutiveSoftwareRiskPageProps) {
  const copy = getExecutiveCopy(locale);
  const route = EXECUTIVE_ROUTES[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: copy.meta.h1,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}${route}`,
    inLanguage: locale,
    description: copy.meta.description,
    provider: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
  };

  return (
    <div className="py-12 md:py-16 bg-background">
      <ExecutiveLocaleSync locale={locale} />
      <JsonLd data={jsonLd} />
      <div className="container mx-auto px-4 max-w-3xl">
        <ExecutiveLanguageBar activeLocale={locale} />

        <header className="text-center mb-10">
          <p className="text-sm font-semibold text-brand-green uppercase tracking-wider mb-3">
            {copy.meta.kicker}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy tracking-tight mb-4">
            {copy.meta.h1}
          </h1>
          <p className="text-lg text-muted-foreground">{copy.meta.subtitle}</p>
          <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            {copy.meta.intro}
          </p>
        </header>

        <ExecutiveSoftwareRiskCalculator locale={locale} route={route} />

        <footer className="mt-12 pt-8 border-t border-border-hairline text-center text-sm text-muted-foreground space-y-2">
          <p>
            {copy.meta.trustLine}{" "}
            <Link
              href={ORGANIZATION.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-green font-semibold"
            >
              {copy.meta.brandLine}
            </Link>
          </p>
          <p>
            <Link href="/privacidad" className="underline hover:text-foreground">
              {copy.meta.privacy}
            </Link>
            {" · "}
            <a href="mailto:info@spritascore.com" className="underline hover:text-foreground">
              info@spritascore.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}