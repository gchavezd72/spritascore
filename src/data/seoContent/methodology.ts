import type { SeoMethodologyContent } from "./types";
import { getCalculatorSeoContent } from "./calculatorPages";

type Locale = "es" | "en" | "pt";
type Market = "us" | "eu" | "es" | "pt";

export function getMethodologyContent(
  internalSlug: string,
  locale: Locale,
  market: Market
): SeoMethodologyContent | null {
  const calc = getCalculatorSeoContent(internalSlug, locale, market);
  if (!calc) return null;

  const titles = {
    es: `Metodología: ${calc.h1}`,
    en: `Methodology: ${calc.h1}`,
    pt: `Metodologia: ${calc.h1}`,
  };

  return {
    h1: titles[locale],
    metaTitle: `${titles[locale]} | SpritaScore`,
    metaDescription:
      locale === "es"
        ? `Cómo funciona el modelo de estimación de SpritaScore para ${calc.h1.toLowerCase()}. Factores, salidas y limitaciones sin revelar fórmulas propietarias.`
        : locale === "pt"
          ? `Como funciona o modelo de estimativa SpritaScore para ${calc.h1.toLowerCase()}. Fatores, saídas e limitações.`
          : `How the SpritaScore estimation model works for ${calc.h1.toLowerCase()}. Factors, outputs and limitations.`,
    overview: [calc.shortAnswer, ...calc.howItWorks.slice(0, 2)],
    factors: [...calc.inputs, ...calc.measures.slice(0, 3)],
    outputs: calc.scoreMeaning,
    limitations: calc.limitations,
    faq: calc.faq.slice(0, 4),
  };
}