import type { CalculatorCategory } from "@/types/calculator";

export const CALCULATOR_CATEGORY_ORDER: CalculatorCategory[] = [
  "seguridad",
  "calidad",
  "compliance",
  "ahorros",
];

export const CALCULATOR_CATEGORY_COLORS: Record<
  CalculatorCategory,
  { bg: string; text: string; border: string }
> = {
  seguridad: {
    bg: "bg-sky-500/10",
    text: "text-sky-700",
    border: "border-sky-500/25",
  },
  calidad: {
    bg: "bg-violet-500/10",
    text: "text-violet-700",
    border: "border-violet-500/25",
  },
  compliance: {
    bg: "bg-amber-500/10",
    text: "text-amber-800",
    border: "border-amber-500/25",
  },
  ahorros: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-700",
    border: "border-emerald-500/25",
  },
};