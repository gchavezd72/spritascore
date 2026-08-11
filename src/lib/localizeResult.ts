import { calculate } from "@/lib/calculateCost";
import type { CalculationResult, Locale } from "@/types/calculator";

/**
 * Re-run calculation in the target locale, preserving identity and lead state.
 * Self-contained calculators (calc05 / custom engines) already ship localized
 * copy at create time and must not pass through the generic wizard engine.
 */
export function localizeResult(
  result: CalculationResult,
  locale: Locale = result.locale ?? "es"
): CalculationResult {
  const customEngine =
    result.inputs?.calculator === "calc05" ||
    result.calculatorId === "executive-software-risk-score" ||
    result.calculatorId === "eu-ai-act-compliance";

  if (customEngine) {
    return { ...result, locale: result.locale ?? locale };
  }

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