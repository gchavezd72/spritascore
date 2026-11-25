import type { CalculatorId, Locale } from "@/types/calculator";

export const AUDIT_ROUTES: Record<Locale, string> = {
  en: "/en/software-audit",
  es: "/es/auditoria-de-software",
  pt: "/pt/auditoria-de-software",
};

export type AuditId = "AUD-01" | "AUD-02" | "AUD-03" | "AUD-04" | "AUD-05" | "AUD-06" | "AUD-07";

export const AUDIT_IDS: AuditId[] = ["AUD-01", "AUD-02", "AUD-03", "AUD-04", "AUD-05", "AUD-06", "AUD-07"];

const AUDIT_MATCH: Record<CalculatorId, { primary: AuditId; alt?: AuditId }> = {
  "executive-software-risk-score": { primary: "AUD-07", alt: "AUD-06" },
  "iso-quality": { primary: "AUD-01", alt: "AUD-05" },
  "owasp-web": { primary: "AUD-02" },
  "owasp-mobile": { primary: "AUD-02", alt: "AUD-03" },
  sector: { primary: "AUD-07", alt: "AUD-02" },
  "aspm-cost": { primary: "AUD-06", alt: "AUD-07" },
  "cra-compliance": { primary: "AUD-03", alt: "AUD-06" },
  "dora-compliance": { primary: "AUD-06" },
  "eu-ai-act-compliance": { primary: "AUD-04", alt: "AUD-06" },
};

export function isAuditCalculatorId(value: unknown): value is CalculatorId {
  return typeof value === "string" && Object.hasOwn(AUDIT_MATCH, value);
}

export function auditMatch(calculatorId: string): { primary: AuditId; alt?: AuditId } {
  if (isAuditCalculatorId(calculatorId)) return AUDIT_MATCH[calculatorId];
  return { primary: "AUD-07" };
}

export function auditPath(locale: Locale, calculatorId?: string): string {
  const base = AUDIT_ROUTES[locale] ?? AUDIT_ROUTES.en;
  if (!calculatorId) return base;
  return `${base}?model=${encodeURIComponent(calculatorId)}`;
}
