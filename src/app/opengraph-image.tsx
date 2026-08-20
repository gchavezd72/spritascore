import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { createOgImage } from "@/lib/ogImage";

export const alt = "SpritaScore | Turn Software Risk into Financial Impact";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createOgImage({
    title: "Turn Software Risk into Financial Impact",
    subtitle: `${CALCULATOR_CONFIGS.length} free calculators · code quality · OWASP · EU AI Act · DORA · CRA. Your score in 5 minutes.`,
    eyebrow: "SpritaScore",
    chips: ["Code quality", "OWASP", "EU AI Act", "DORA", "CRA"],
  });
}