import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sprita iT Analytics — Kiuwan CSV, SARIF y SBOM",
  description:
    "Visualice vulnerabilidades de aplicación, componentes de terceros y calidad de código a partir de exportaciones Kiuwan. Embudo de las 10 críticas, radar de cinco atributos y marca Sprita iT.",
  alternates: { canonical: `${SITE_URL}/analytics` },
  openGraph: {
    title: "Sprita iT Analytics",
    description: "Análisis visual de resultados Kiuwan: seguridad, SCA y calidad.",
    url: `${SITE_URL}/analytics`,
    siteName: "Sprita iT Analytics",
  },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 z-[80] overflow-auto">{children}</div>;
}
