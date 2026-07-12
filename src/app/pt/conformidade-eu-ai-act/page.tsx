import type { Metadata } from "next";
import { EuAiActPage } from "@/components/euaiact/EuAiActPage";
import { getEuAiActCopy, EU_AI_ACT_ROUTES } from "@/i18n/euAiAct";
import { SITE_URL } from "@/lib/seo";

const locale = "pt" as const;
const copy = getEuAiActCopy(locale);
const route = EU_AI_ACT_ROUTES[locale];

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: {
    canonical: `${SITE_URL}${route}`,
    languages: {
      en: `${SITE_URL}${EU_AI_ACT_ROUTES.en}`,
      es: `${SITE_URL}${EU_AI_ACT_ROUTES.es}`,
      pt: `${SITE_URL}${EU_AI_ACT_ROUTES.pt}`,
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
  return <EuAiActPage locale={locale} />;
}
