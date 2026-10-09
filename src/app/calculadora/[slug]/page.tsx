import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getCalculatorBySlug, CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { getEuAiActRoute } from "@/data/euAiAct";
import { getExecutiveRoute } from "@/data/executiveSoftwareRiskScore";
import { CalculatorWizard } from "@/components/CalculatorWizard";
import { CalculatorPageHeader } from "@/components/CalculatorPageHeader";
import { JsonLd } from "@/components/JsonLd";
import { getCalc05Route } from "@/i18n/calc05";
import { readLocaleCookie } from "@/lib/localePreference";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CALCULATOR_CONFIGS.filter(
    (c) =>
      !c.customRoute &&
      c.id !== "executive-software-risk-score" &&
      c.id !== "sector"
  ).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return calculatorMetadata(slug);
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const config = getCalculatorBySlug(slug);
  if (!config) notFound();
  const locale = readLocaleCookie((await cookies()).get("spritascore_locale")?.value);
  if (config.id === "executive-software-risk-score") {
    redirect(getExecutiveRoute(locale));
  }
  if (config.id === "sector") {
    redirect(getCalc05Route(locale));
  }
  if (config.id === "eu-ai-act-compliance") {
    redirect(getEuAiActRoute(locale));
  }
  if (config.customRoute) redirect(config.customRoute);

  return (
    <div className="py-12 bg-background min-h-screen">
      <JsonLd data={calculatorJsonLd(config)} />
      <div className="container mx-auto px-4">
        <CalculatorPageHeader config={config} />
        <CalculatorWizard config={config} />
      </div>
    </div>
  );
}