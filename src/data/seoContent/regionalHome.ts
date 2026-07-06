import type { RegionalHomeContent } from "./types";
import type { Region } from "@/lib/regions";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";

const COUNT = CALCULATOR_CONFIGS.length;

const CONTENT: Record<Region, RegionalHomeContent> = {
  "es-es": {
    h1: "Calculadora de riesgo y costo de software para dirección y equipos técnicos",
    metaTitle: "SpritaScore España — Riesgo de aplicaciones, OWASP, CRA y DORA en impacto financiero",
    metaDescription: `SpritaScore traduce vulnerabilidades, deuda técnica y brechas de compliance (CRA, DORA, NIS2) en estimaciones económicas ejecutivas. ${COUNT} calculadoras en español.`,
    intro: [
      "SpritaScore es la plataforma de calculadoras de riesgo y costo de software de Sprita iT. Convierte hallazgos de seguridad de aplicaciones, calidad de código y cumplimiento normativo europeo en cifras que finanzas y dirección pueden priorizar.",
      "Orientada a organizaciones en España y LATAM que desarrollan o integran software con exposición al EU Cyber Resilience Act, DORA y NIS2, SpritaScore ofrece score de riesgo, rangos de costo y recomendaciones en minutos.",
    ],
    valueProps: [
      { title: "Lenguaje financiero", body: "Cada calculadora devuelve escenarios mínimo, probable y alto más matriz de impacto." },
      { title: "Compliance UE", body: "Modelos específicos para CRA y DORA con evidencia orientada a auditoría." },
      { title: "Sin caja negra", body: "Factores de riesgo visibles y metodología publicada por calculadora." },
    ],
    faq: [
      { question: "¿Qué es SpritaScore?", answer: "Una marca de Sprita iT que ofrece calculadoras B2B para estimar el costo del riesgo de software." },
      { question: "¿Es una auditoría?", answer: "No. Son estimaciones orientativas basadas en sus respuestas y modelos de referencia." },
      { question: "¿Incluye DORA y CRA?", answer: "Sí. Hay calculadoras dedicadas a resiliencia operativa digital (DORA) y Cyber Resilience Act." },
      { question: "¿En qué idiomas está?", answer: "Interfaz y reportes en español, inglés y portugués." },
      { question: "¿Quién está detrás?", answer: "Sprita iT (sprita-it.com), especialistas en SAST, DAST, SCA y calidad de código." },
    ],
  },
  "en-us": {
    h1: "Application security risk and cost calculator for executives and AppSec teams",
    metaTitle: "SpritaScore US — OWASP, technical debt, ASPM ROI and software risk in dollars",
    metaDescription: `Translate AppSec and software quality risk into financial impact. ${COUNT} calculators for OWASP Top 10, ISO 25010 debt, ASPM ROI and sector exposure. By Sprita iT.`,
    intro: [
      "SpritaScore is Sprita iT's application risk and cost calculator platform. It helps CISOs, engineering leaders and compliance teams express vulnerability exposure, technical debt and tool sprawl in executive-ready economics.",
      "Built for US organizations aligning with OWASP, NIST SSDF practices and SEC cybersecurity disclosure readiness, SpritaScore delivers risk scores, cost ranges and prioritized actions in minutes.",
    ],
    valueProps: [
      { title: "Executive-ready", body: "Probable cost scenarios and impact matrix for board conversations." },
      { title: "AppSec & ASPM", body: "Quantify OWASP exposure and the cost of disconnected security tools." },
      { title: "Evidence-oriented", body: "Methodology pages explain inputs and outputs without black-box scoring." },
    ],
    faq: [
      { question: "What is SpritaScore?", answer: "A Sprita iT brand offering B2B calculators that translate software risk into financial estimates." },
      { question: "Is this a formal audit?", answer: "No. Results are indicative estimates, not certification or legal opinion." },
      { question: "Does it cover OWASP Top 10?", answer: "Yes, including web and mobile OWASP calculators with cost modeling." },
      { question: "Who builds SpritaScore?", answer: "Sprita iT (sprita-it.com), application security and code quality specialists." },
      { question: "Can I get a technical diagnosis?", answer: "Yes. Request a Sprita iT assessment to validate findings beyond the calculator." },
    ],
  },
  "en-eu": {
    h1: "Cyber resilience and application risk calculator for EU software organizations",
    metaTitle: "SpritaScore EU — CRA, DORA, NIS2 and OWASP risk in financial terms",
    metaDescription: `EU-focused calculators for Cyber Resilience Act, DORA, NIS2 readiness and OWASP cost. ${COUNT} models by Sprita iT with SBOM and vulnerability governance context.`,
    intro: [
      "SpritaScore helps EU-facing software providers and financial entities translate digital operational resilience obligations into measurable economic exposure.",
      "With dedicated CRA and DORA assessments plus OWASP and technical debt calculators, SpritaScore supports evidence-building for regulators, auditors and enterprise buyers.",
    ],
    valueProps: [
      { title: "CRA & DORA", body: "Compliance gap scoring with remediation cost ranges and executive summaries." },
      { title: "Supply chain", body: "Sector and ASPM models highlight concentration and tool-sprawl risk." },
      { title: "Multilingual", body: "Reports in English, Spanish and Portuguese for pan-European teams." },
    ],
    faq: [
      { question: "Does SpritaScore assess CRA conformity?", answer: "It estimates compliance gaps and exposure; it does not replace notified body assessment." },
      { question: "Is DORA covered?", answer: "Yes, via a 15-question ICT resilience maturity assessment mapped to DORA pillars." },
      { question: "What about NIS2?", answer: "Guide content links application security controls to NIS2 expectations; dedicated calculator roadmap aligns with NIS2 themes." },
      { question: "Who is Sprita iT?", answer: "The parent company behind SpritaScore, offering SAST, DAST, SCA and quality services at sprita-it.com." },
      { question: "Are results legally binding?", answer: "No. They are planning estimates; verify regulatory text before contractual commitments." },
    ],
  },
  "pt-pt": {
    h1: "Calculadora de risco e custo de software para equipas técnicas e direção",
    metaTitle: "SpritaScore — Risco de aplicações, OWASP, CRA e DORA em impacto financeiro",
    metaDescription: `Traduza vulnerabilidades, dívida técnica e compliance (CRA, DORA) em estimativas executivas. ${COUNT} calculadoras da Sprita iT em português.`,
    intro: [
      "SpritaScore é a plataforma de calculadoras de risco e custo de software da Sprita iT. Converte riscos de segurança de aplicações e lacunas de conformidade europeia em números acionáveis.",
      "Pensada para organizações em Portugal e Brasil com clientes ou operações na UE, disponibiliza score de risco, intervalos de custo e recomendações priorizadas.",
    ],
    valueProps: [
      { title: "Impacto financeiro", body: "Cenários de custo e matriz de impacto para comités de gestão." },
      { title: "Regulação UE", body: "Calculadoras CRA e DORA com linguagem orientada a evidências." },
      { title: "Transparência", body: "Metodologia documentada e FAQ em HTML indexável." },
    ],
    faq: [
      { question: "O que é o SpritaScore?", answer: "Uma marca da Sprita iT com calculadoras B2B de risco de software." },
      { question: "Substitui uma auditoria?", answer: "Não. São estimativas orientativas." },
      { question: "Inclui OWASP?", answer: "Sim, Top 10 web e mobile." },
      { question: "Quem desenvolve?", answer: "Sprita iT — sprita-it.com." },
      { question: "Posso pedir diagnóstico técnico?", answer: "Sim, através do contacto Sprita iT." },
    ],
  },
};

export function getRegionalHomeContent(region: Region): RegionalHomeContent {
  return CONTENT[region];
}