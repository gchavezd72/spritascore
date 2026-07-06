import { getCalculatorBySlug, CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { CALCULATOR_SEO } from "@/lib/seo";
import { createOgImage, OG_SIZE } from "@/lib/ogImage";
import { tr } from "@/lib/translate";

export const size = OG_SIZE;
export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CALCULATOR_CONFIGS.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const config = getCalculatorBySlug(slug);

  if (!config) {
    return createOgImage({ title: "Calculadora no encontrada" });
  }

  const title = CALCULATOR_SEO[slug]?.title.es ?? tr(config.title, "es");
  const subtitle = tr(config.shortDescription, "es").slice(0, 120);

  return createOgImage({
    title,
    subtitle,
    eyebrow: "SpritaScore · Calculadora de riesgo",
    chips: ["Score de riesgo", "Estimación económica", "ES · EN · PT"],
  });
}