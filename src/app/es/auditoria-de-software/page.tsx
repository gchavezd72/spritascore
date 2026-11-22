import type { Metadata } from "next";
import { AuditLanding } from "@/components/audit/AuditLanding";
import { getAuditCopy } from "@/i18n/audit";
import { AUDIT_ROUTES } from "@/lib/auditRoutes";
import { SITE_URL } from "@/lib/seo";

const locale = "es" as const;
const copy = getAuditCopy(locale);

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: {
    canonical: `${SITE_URL}${AUDIT_ROUTES.es}`,
    languages: {
      en: `${SITE_URL}${AUDIT_ROUTES.en}`,
      es: `${SITE_URL}${AUDIT_ROUTES.es}`,
      pt: `${SITE_URL}${AUDIT_ROUTES.pt}`,
      "x-default": `${SITE_URL}${AUDIT_ROUTES.en}`,
    },
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ model?: string }>;
}) {
  const { model } = await searchParams;
  return <AuditLanding locale={locale} model={model} />;
}
