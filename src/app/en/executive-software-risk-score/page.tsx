import type { Metadata } from "next";
import Link from "next/link";
import { ExecutiveSoftwareRiskCalculator } from "@/components/executive/ExecutiveSoftwareRiskCalculator";
import { JsonLd } from "@/components/JsonLd";
import { ORGANIZATION, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Executive Software Risk Score | SpritaScore by Sprita iT",
  description:
    "A 15-question software risk self-assessment for CIO, CISO, Risk and Technology teams. Identify gaps across AI-assisted code, vendor code, open-source dependencies and release controls.",
  alternates: {
    canonical: `${SITE_URL}/en/executive-software-risk-score`,
  },
  openGraph: {
    title: "Executive Software Risk Score",
    description:
      "15 questions. 3 minutes. No code upload. Identify software risk visibility gaps before audit, examiner, or operational pressure.",
    url: `${SITE_URL}/en/executive-software-risk-score`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Executive Software Risk Score",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}/en/executive-software-risk-score`,
  description:
    "Executive self-assessment for software risk visibility across governance, secure development, supply chain, and audit evidence.",
  provider: {
    "@type": "Organization",
    name: ORGANIZATION.name,
    url: ORGANIZATION.url,
  },
};

export default function ExecutiveSoftwareRiskScorePage() {
  return (
    <div className="py-12 md:py-16 bg-background">
      <JsonLd data={jsonLd} />
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="text-center mb-10">
          <p className="text-sm font-semibold text-brand-green uppercase tracking-wider mb-3">
            Executive diagnostic · SpritaScore by Sprita iT
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy tracking-tight mb-4">
            Executive Software Risk Score
          </h1>
          <p className="text-lg text-muted-foreground">
            15 questions · 3 minutes · For CIO, CISO, Risk and Technology teams
          </p>
          <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            No code upload required. No sensitive technical data required. Results can remain local
            in the browser unless you request a report. This assessment surfaces visibility gaps
            across internal code, vendor code, AI-assisted code, open-source dependencies, release
            controls, audit evidence, and remediation discipline.
          </p>
        </header>

        <ExecutiveSoftwareRiskCalculator />

        <footer className="mt-12 pt-8 border-t border-border-hairline text-center text-sm text-muted-foreground space-y-2">
          <p>
            SpritaScore is a brand of{" "}
            <Link href={ORGANIZATION.url} target="_blank" rel="noopener noreferrer" className="text-brand-green font-semibold">
              Sprita iT
            </Link>
          </p>
          <p>
            <Link href="/privacidad" className="underline hover:text-foreground">
              Privacy policy
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