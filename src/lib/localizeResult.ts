import { calculate } from "@/lib/calculateCost";
import type { CalculationResult, Locale } from "@/types/calculator";

/** Re-run calculation in the target locale, preserving identity and lead state. */
export function localizeResult(
  result: CalculationResult,
  locale: Locale = result.locale ?? "es"
): CalculationResult {
  const fresh = calculate(
    result.calculatorId,
    result.inputs,
    result.currency,
    locale
  );
  return {
    ...fresh,
    id: result.id,
    createdAt: result.createdAt,
    leadCaptured: result.leadCaptured,
    locale,
  };
}