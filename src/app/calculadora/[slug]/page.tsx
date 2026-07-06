import { notFound, redirect } from "next/navigation";
import { getCalculatorBySlug, CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { CalculatorWizard } from "@/components/CalculatorWizard";
import { CalculatorPageHeader } from "@/components/CalculatorPageHeader";
import { JsonLd } from "@/components/JsonLd";
import { calculatorJsonLd, calculatorMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CALCULATOR_CONFIGS.filter(
    (c) => !c.customRoute && c.id !== "executive-software-risk-score"
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
  if (config.id === "executive-software-risk-score") {
    redirect("/en/executive-software-risk-score");
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