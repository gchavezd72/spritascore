import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCalculatorBySlug, CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { CalculatorWizard } from "@/components/CalculatorWizard";
import { CalculatorPageHeader } from "@/components/CalculatorPageHeader";
import { tr } from "@/lib/translate";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CALCULATOR_CONFIGS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getCalculatorBySlug(slug);
  if (!config) return { title: "Calculadora no encontrada" };

  const seoTitles: Record<string, string> = {
    "no-calidad-codigo": "Calculadora de costo de deuda técnica y no calidad ISO 25010",
    "owasp-top10-web": "Calculadora de costo de vulnerabilidad OWASP Top 10",
    "owasp-mobile-top10": "Calculadora de vulnerabilidades móviles OWASP Mobile Top 10",
    "riesgo-por-sector": "Calculadora de riesgo y costo por sector industrial",
    "costo-de-no-usar-aspm": "Calculadora de costo de no tener un ASPM",
    "compliance-eu-cra": "Evaluación de compliance con el EU Cyber Resilience Act",
  };

  return {
    title: seoTitles[slug] ?? tr(config.title, "es"),
    description: tr(config.shortDescription, "es"),
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const config = getCalculatorBySlug(slug);
  if (!config) notFound();

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <CalculatorPageHeader config={config} />
        <CalculatorWizard config={config} />
      </div>
    </div>
  );
}