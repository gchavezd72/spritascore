import type { Metadata } from "next";
import { Calc05Page } from "@/components/calc05/Calc05Page";
import { getCalc05Copy, CALC05_ROUTES } from "@/i18n/calc05";
import { SITE_URL } from "@/lib/seo";

const locale = "es" as const;
const copy = getCalc05Copy(locale);
const route = CALC05_ROUTES[locale];

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: {
    canonical: `${SITE_URL}${route}`,
    languages: {
      es: `${SITE_URL}${CALC05_ROUTES.es}`,
      en: `${SITE_URL}${CALC05_ROUTES.en}`,
      pt: `${SITE_URL}${CALC05_ROUTES.pt}`,
    },
  },
  openGraph: {
    title: copy.meta.h1,
    description: copy.meta.ogDescription,
    url: `${SITE_URL}${route}`,
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const sector = typeof params.sector === "string" ? params.sector : undefined;
  const querySuffix = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) =>
      typeof v === "string" ? [[k, v]] : Array.isArray(v) ? v.map((x) => [k, x]) : []
    )
  ).toString();

  return (
    <Calc05Page locale={locale} initialSector={sector} querySuffix={querySuffix} />
  );
}
