import type { Locale } from "@/types/calculator";

export const EXECUTIVE_ROUTES: Record<Locale, string> = {
  en: "/en/executive-software-risk-score",
  es: "/es/puntaje-ejecutivo-riesgo-software",
  pt: "/pt/pontuacao-executiva-risco-software",
};

export type ExecutiveAnswerId = "yes" | "partially" | "no" | "not_sure";

export type ExecutiveWeakCategory =
  | "ai-assisted-code"
  | "vendor-delivered-code"
  | "open-source-dependencies"
  | "release-controls"
  | "audit-evidence"
  | "software-governance";

export const EXECUTIVE_ANSWER_POINTS: Record<ExecutiveAnswerId, number> = {
  yes: 1,
  partially: 0.5,
  no: 0,
  not_sure: 0,
};

export const EXECUTIVE_QUESTION_META: {
  id: string;
  category: (typeof EXECUTIVE_SECTIONS)[number];
  weakCategory: ExecutiveWeakCategory;
}[] = [
  { id: "q1", category: "software-governance", weakCategory: "software-governance" },
  { id: "q2", category: "software-governance", weakCategory: "software-governance" },
  { id: "q3", category: "software-governance", weakCategory: "software-governance" },
  { id: "q4", category: "secure-development", weakCategory: "software-governance" },
  { id: "q5", category: "secure-development", weakCategory: "vendor-delivered-code" },
  { id: "q6", category: "secure-development", weakCategory: "ai-assisted-code" },
  { id: "q7", category: "dependencies-supply-chain", weakCategory: "open-source-dependencies" },
  { id: "q8", category: "dependencies-supply-chain", weakCategory: "open-source-dependencies" },
  { id: "q9", category: "dependencies-supply-chain", weakCategory: "open-source-dependencies" },
  { id: "q10", category: "quality-continuity", weakCategory: "software-governance" },
  { id: "q11", category: "quality-continuity", weakCategory: "release-controls" },
  { id: "q12", category: "quality-continuity", weakCategory: "release-controls" },
  { id: "q13", category: "compliance-audit-evidence", weakCategory: "audit-evidence" },
  { id: "q14", category: "compliance-audit-evidence", weakCategory: "audit-evidence" },
  { id: "q15", category: "compliance-audit-evidence", weakCategory: "audit-evidence" },
];

export const WEAK_CATEGORY_PRIORITY: ExecutiveWeakCategory[] = [
  "ai-assisted-code",
  "vendor-delivered-code",
  "open-source-dependencies",
  "release-controls",
  "audit-evidence",
  "software-governance",
];

export const EXECUTIVE_SECTIONS = [
  "software-governance",
  "secure-development",
  "dependencies-supply-chain",
  "quality-continuity",
  "compliance-audit-evidence",
] as const;

export function getExecutiveRoute(locale: Locale): string {
  return EXECUTIVE_ROUTES[locale] ?? EXECUTIVE_ROUTES.en;
}

export const EXECUTIVE_CARD = {
  id: "executive-software-risk-score" as const,
  slug: "executive-software-risk-score",
  category: "seguridad" as const,
  title: {
    es: "Puntaje Ejecutivo de Riesgo de Software",
    en: "Executive Software Risk Score",
    pt: "Pontuação Executiva de Risco de Software",
  },
  shortDescription: {
    es: "Identifique brechas de visibilidad en código asistido por IA, software de proveedores, dependencias open source y controles de release.",
    en: "Identify visibility gaps across AI-assisted code, vendor-delivered software, open-source dependencies, and release controls.",
    pt: "Identifique lacunas de visibilidade em código assistido por IA, software de fornecedores, dependências open source e controles de release.",
  },
  kicker: {
    es: "15 preguntas · 3 minutos · Sin subir código",
    en: "15 questions · 3 minutes · No code upload",
    pt: "15 perguntas · 3 minutos · Sem upload de código",
  },
  badge: {
    es: "Diagnóstico ejecutivo",
    en: "Executive diagnostic",
    pt: "Diagnóstico executivo",
  },
  audience: {
    es: "CIO · CISO · Riesgo · Tecnología",
    en: "CIO · CISO · Risk · Technology",
    pt: "CIO · CISO · Risco · Tecnologia",
  },
  ctaLabel: {
    es: "Calcular mi puntaje de riesgo de software",
    en: "Calculate my software risk score",
    pt: "Calcular minha pontuação de risco de software",
  },
  complexity: "baja" as const,
  estimatedTime: { es: "3 minutos", en: "3 minutes", pt: "3 minutos" },
  featured: true,
  steps: [],
};