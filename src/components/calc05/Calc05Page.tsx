import Link from "next/link";
import { Calc05 } from "@/components/calc05/Calc05";
import { Calc05LanguageBar } from "@/components/calc05/Calc05LanguageBar";
import { Calc05LocaleSync } from "@/components/calc05/Calc05LocaleSync";
import { JsonLd } from "@/components/JsonLd";
import { getCalc05Copy, CALC05_ROUTES } from "@/i18n/calc05";
import type { Sector } from "@/lib/calc05";
import { ORGANIZATION, SITE_URL } from "@/lib/seo";
import type { Locale } from "@/types/calculator";

const VALID_SECTORS: Sector[] = [
  "saude",
  "tech",
  "fintech",
  "seguros",
  "varejo",
  "industria",
  "publico",
  "outro",
];

interface Calc05PageProps {
  locale: Locale;
  initialSector?: string;
  /** Raw search string without leading ? (e.g. sector=saude&utm_source=instantly) */
  querySuffix?: string;
}

export function Calc05Page({
  locale,
  initialSector,
  querySuffix = "",
}: Calc05PageProps) {
  const copy = getCalc05Copy(locale);
  const route = CALC05_ROUTES[locale];
  const validatedSector = VALID_SECTORS.includes(initialSector as Sector)
    ? (initialSector as Sector)
    : undefined;
  const suffix = querySuffix ? `?${querySuffix}` : "";

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
    <div className="py-12 md:py-16 bg-background min-h-[70vh]">
      <Calc05LocaleSync locale={locale} />
      <JsonLd data={jsonLd} />
      <div className="container mx-auto px-4 max-w-3xl">
        <Calc05LanguageBar activeLocale={locale} querySuffix={suffix} />

        <Calc05 copy={copy} locale={locale} initialSector={validatedSector} />

        <footer className="mt-12 pt-8 border-t border-border-hairline text-center text-sm text-muted-foreground space-y-2">
          <p>
            SpritaScore ·{" "}
            <Link href={SITE_URL} className="text-brand-green font-semibold">
              spritascore.com
            </Link>
          </p>
          <p>
            <Link href="/privacidad" className="underline hover:text-foreground">
              {locale === "en"
                ? "Privacy policy"
                : locale === "pt"
                  ? "Política de privacidade"
                  : "Política de privacidad"}
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
