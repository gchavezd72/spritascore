import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { createOgImage } from "@/lib/ogImage";

export const alt =
  "SpritaScore — Calculadora de riesgo y costo de software para DevSecOps y ASPM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    title: "Riesgo técnico → impacto financiero",
    subtitle: `${CALCULATOR_CONFIGS.length} calculadoras · OWASP · ISO 25010 · CRA · DORA · ASPM`,
  });
}