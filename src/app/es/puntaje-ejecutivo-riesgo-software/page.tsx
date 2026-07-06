import type { Metadata } from "next";
import { ExecutiveSoftwareRiskPage } from "@/components/executive/ExecutiveSoftwareRiskPage";
import { getExecutiveCopy, EXECUTIVE_ROUTES } from "@/i18n/executive";
import { SITE_URL } from "@/lib/seo";

const locale = "es" as const;
const copy = getExecutiveCopy(locale);
const route = EXECUTIVE_ROUTES[locale];

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: {
    canonical: `${SITE_URL}${route}`,
    languages: {
      en: `${SITE_URL}${EXECUTIVE_ROUTES.en}`,
      es: `${SITE_URL}${EXECUTIVE_ROUTES.es}`,
      pt: `${SITE_URL}${EXECUTIVE_ROUTES.pt}`,
    },
  },
  openGraph: {
    title: copy.meta.h1,
    description: copy.meta.ogDescription,
    url: `${SITE_URL}${route}`,
    type: "website",
  },
};

export default function Page() {
  return <ExecutiveSoftwareRiskPage locale={locale} />;
}