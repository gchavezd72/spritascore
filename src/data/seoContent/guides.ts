import type { SeoGuideContent } from "./types";
import type { GuideSlug } from "@/lib/seoRoutes";

type Locale = "es" | "en" | "pt";
type Market = "us" | "eu" | "es" | "pt";

const GUIDES: Record<GuideSlug, Partial<Record<`${Locale}:${Market}`, SeoGuideContent>>> = {
  "owasp-top-10-risk": {
    "es:es": {
      h1: "Guía: riesgo y costo OWASP Top 10 para aplicaciones web",
      metaTitle: "Guía OWASP Top 10 — Riesgo y costo | SpritaScore",
      metaDescription: "Qué mide el OWASP Top 10, cómo priorizar vulnerabilidades web y traducir exposición en impacto financiero con SpritaScore.",
      summary: "El OWASP Top 10 2021 agrupa las categorías de fallos más críticos en aplicaciones web. SpritaScore ayuda a estimar el costo de exposición según categoría, explotabilidad y contexto de negocio.",
      sections: [
        { heading: "Por qué importa en 2026", paragraphs: ["Las brechas siguen originándose en fallos de diseño, control de acceso roto e inyecciones. Para equipos con clientes en la UE, un incidente OWASP puede activar obligaciones CRA y NIS2 de reporte y remediación documentada.", "Traducir el Top 10 a cifras facilita presupuestos de AppSec, SAST/DAST y programa de remediación."] },
        { heading: "Categorías con mayor impacto económico", paragraphs: ["A01 Broken Access Control y A07 Identification and Authentication Failures suelen asociarse a exposición de datos masiva.", "A03 Injection y A05 Security Misconfiguration incrementan costos de respuesta y parches urgentes.", "Use la calculadora SpritaScore OWASP para modelar su categoría principal y días de exposición."] },
        { heading: "De hallazgo a decisión ejecutiva", paragraphs: ["Priorice por explotabilidad real, datos sensibles y tiempo de exposición, no solo por severidad teórica.", "Combine SAST en CI, DAST periódico y revisión de controles de acceso.", "Sprita iT puede validar el resultado con un Software Risk Assessment."] },
      ],
      faq: [
        { question: "¿OWASP Top 10 sustituye un pentest?", answer: "No. Es una taxonomía de referencia; la calculadora estima impacto económico según su contexto." },
        { question: "¿Incluye API?", answer: "Muchas categorías aplican a APIs; use la calculadora web con tipo de aplicación API si corresponde." },
        { question: "¿Cada cuánto actualizar?", answer: "Revise el Top 10 vigente y re-ejecute la calculadora tras cambios arquitectónicos mayores." },
        { question: "¿Relación con CRA?", answer: "Vulnerabilidades explotables conocidas sin parche pueden generar obligaciones de reporte bajo CRA." },
      ],
      references: [
        { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
        { label: "SpritaScore calculadora OWASP", url: "https://spritascore.com/es-es/calculadoras/costo-vulnerabilidad-owasp-top10" },
      ],
    },
    "en:us": {
      h1: "Guide: OWASP Top 10 application risk and cost",
      metaTitle: "OWASP Top 10 risk guide | SpritaScore",
      metaDescription: "Prioritize OWASP Top 10 categories and estimate financial exposure for US AppSec and SEC disclosure readiness.",
      summary: "The OWASP Top 10 2021 frames the most critical web application risk categories. SpritaScore translates category, exploitability and business context into probable cost ranges.",
      sections: [
        { heading: "Why it matters for US leadership", paragraphs: ["SEC cybersecurity disclosure and shareholder scrutiny increase the cost of undetected access control and authentication failures.", "Boards expect quantified scenarios, not only CVSS counts."] },
        { heading: "High-impact categories", paragraphs: ["Broken Access Control and Injection remain top drivers of breach cost.", "Security Misconfiguration amplifies cloud and CI/CD attack surface.", "Run the SpritaScore OWASP calculator with your primary category and exposure window."] },
        { heading: "From findings to budget", paragraphs: ["Weight exploitability, sensitive records and revenue at risk.", "Integrate SAST, DAST and ASPM for continuous visibility.", "Sprita iT offers technical validation beyond the calculator estimate."] },
      ],
      faq: [
        { question: "Does this replace penetration testing?", answer: "No. It is a financial planning layer on top of OWASP taxonomy." },
        { question: "Mobile apps?", answer: "Use the dedicated OWASP Mobile Top 10 calculator for iOS/Android." },
        { question: "NIST SSDF alignment?", answer: "OWASP remediation supports SSDF practices; map calculator outputs to your SSDF roadmap." },
        { question: "How often to rerun?", answer: "After major releases, architecture changes or incident postmortems." },
      ],
      references: [
        { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
        { label: "NIST SSDF", url: "https://csrc.nist.gov/pubs/sp/800/218/final" },
      ],
    },
    "en:eu": {
      h1: "Guide: OWASP Top 10 risk for EU software compliance",
      metaTitle: "OWASP Top 10 EU guide | SpritaScore",
      metaDescription: "Link OWASP web risks to CRA vulnerability handling and executive cost estimates.",
      summary: "EU software vendors must demonstrate secure development and vulnerability management. OWASP Top 10 categories map directly to technical measures expected under CRA and customer due diligence.",
      sections: [
        { heading: "CRA and secure development", paragraphs: ["Annex I CRA expects products without known exploitable vulnerabilities at release and documented lifecycle management.", "OWASP categories help structure SAST/DAST coverage and evidence."] },
        { heading: "Cost of delay", paragraphs: ["Active exploitation triggers reporting timelines; model exposure days in SpritaScore.", "Authentication and access control failures drive regulatory and contractual liability in B2B software."] },
        { heading: "Evidence pack", paragraphs: ["Pair calculator output with scan reports, remediation SLAs and SBOM where applicable.", "Sprita iT supports audit-ready binders for enterprise buyers."] },
      ],
      faq: [
        { question: "CRA vs OWASP?", answer: "CRA sets legal obligations; OWASP helps prioritize technical work that supports compliance." },
        { question: "SBOM link?", answer: "Component risk (A06) connects to SCA and SBOM maintenance under CRA." },
        { question: "DORA relevance?", answer: "Financial ICT systems with web exposure should align OWASP remediation with DORA resilience testing." },
        { question: "Formal audit?", answer: "Calculator results are indicative; engage Sprita iT for assessment." },
      ],
      references: [
        { label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" },
        { label: "EU CRA summary", url: "https://digital-strategy.ec.europa.eu/en/policies/cra-summary" },
      ],
    },
    "pt:pt": {
      h1: "Guia: risco e custo OWASP Top 10",
      metaTitle: "Guia OWASP Top 10 | SpritaScore",
      metaDescription: "Priorize categorias OWASP e estime impacto financeiro para equipas em Portugal e Brasil.",
      summary: "O OWASP Top 10 estrutura os riscos web mais críticos. O SpritaScore estima exposição económica conforme categoria e contexto.",
      sections: [
        { heading: "Contexto regulatório", paragraphs: ["Organizações que vendem para a UE devem alinhar remediação OWASP com CRA e expectativas de clientes.", "Falhas de controlo de acesso têm custo reputacional elevado."] },
        { heading: "Priorização", paragraphs: ["Combine severidade com explorabilidade e volume de dados.", "Use SAST/DAST contínuos e a calculadora SpritaScore para cenários financeiros."] },
        { heading: "Próximos passos", paragraphs: ["Documente SLAs de correção.", "Solicite diagnóstico Sprita iT para validação técnica."] },
      ],
      faq: [
        { question: "Substitui pentest?", answer: "Não. É uma camada de planeamento financeiro." },
        { question: "Mobile?", answer: "Use a calculadora OWASP Mobile." },
        { question: "Idiomas?", answer: "Relatórios em PT, ES e EN." },
        { question: "Sprita iT?", answer: "Marca-mãe em sprita-it.com." },
      ],
      references: [{ label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }],
    },
  },
  "eu-cra-readiness": {
    "es:es": {
      h1: "Guía: preparación para el EU Cyber Resilience Act (CRA)",
      metaTitle: "Guía CRA — Gestión de vulnerabilidades | SpritaScore",
      metaDescription: "Requisitos clave del CRA, SBOM, reporte de vulnerabilidades y cómo evaluar brechas con SpritaScore.",
      summary: "El CRA impone seguridad por diseño, gestión del ciclo de vida de vulnerabilidades y reporte a ENISA. SpritaScore estima brechas y costo de remediación.",
      sections: [
        { heading: "Obligaciones esenciales", paragraphs: ["Anexo I Parte I: seguridad por diseño, sin vulnerabilidades explotables conocidas al lanzar.", "Parte II: SBOM, divulgación coordinada, parches y soporte de seguridad."] },
        { heading: "Fechas clave", paragraphs: ["Reporte de vulnerabilidades activamente explotadas desde septiembre 2026.", "Conformidad plena desde diciembre 2027 para muchos productos."] },
        { heading: "Cómo usar SpritaScore", paragraphs: ["Ejecute la calculadora CRA con su categoría de producto y prácticas actuales.", "Use el informe para roadmap de remediación y presupuesto."] },
      ],
      faq: [
        { question: "¿Productos fuera de la UE?", answer: "Si coloca productos en el mercado UE, aplica según alcance CRA." },
        { question: "¿SBOM obligatorio?", answer: "Es parte central de gestión de vulnerabilidades bajo CRA." },
        { question: "¿Organismo notificado?", answer: "Productos importantes/críticos requieren evaluación de terceros." },
        { question: "¿Sprita iT ayuda?", answer: "Sí, con evaluación técnica y evidencias SAST/SCA." },
      ],
      references: [
        { label: "EU CRA summary", url: "https://digital-strategy.ec.europa.eu/en/policies/cra-summary" },
        { label: "Calculadora CRA SpritaScore", url: "https://spritascore.com/es-es/calculadoras/cyber-resilience-act" },
      ],
    },
    "en:eu": {
      h1: "Guide: EU Cyber Resilience Act readiness",
      metaTitle: "CRA vulnerability handling guide | SpritaScore",
      metaDescription: "CRA essential requirements, SBOM and reporting timelines with SpritaScore gap assessment.",
      summary: "The CRA sets binding cybersecurity rules for products with digital elements placed on the EU market.",
      sections: [
        { heading: "Core duties", paragraphs: ["Secure by design, vulnerability handling, technical documentation and conformity assessment for important/critical products."] },
        { heading: "Reporting", paragraphs: ["Actively exploited vulnerabilities must be reported within 24 hours to ENISA/CSIRT."] },
        { heading: "SpritaScore CRA calculator", paragraphs: ["Scores gap across essential requirements, vuln management and reporting.", "Outputs regulatory exposure ranges and prioritized actions."] },
      ],
      faq: [
        { question: "Open source?", answer: "CRA applies to commercial placement; assess your product role in the supply chain." },
        { question: "SBOM format?", answer: "Maintain machine-readable SBOM and update with releases." },
        { question: "Penalties?", answer: "Fines up to EUR 15M or 2.5% turnover; calculator models exposure bands." },
        { question: "Next step?", answer: "Technical diagnosis with Sprita iT." },
      ],
      references: [{ label: "EU CRA", url: "https://digital-strategy.ec.europa.eu/en/policies/cra-summary" }],
    },
    "en:us": {
      h1: "Guide: EU CRA readiness for US vendors selling into Europe",
      metaTitle: "EU CRA guide for US software vendors | SpritaScore",
      metaDescription: "What US software companies must plan for when placing products on the EU market under CRA.",
      summary: "US vendors with EU customers face CRA obligations when placing products with digital elements on the EU market.",
      sections: [
        { heading: "Market access", paragraphs: ["CRA is a market-entry regulation; due diligence questionnaires increasingly mirror its controls."] },
        { heading: "Operational impact", paragraphs: ["SBOM, coordinated disclosure and security support periods require process investment."] },
        { heading: "Use SpritaScore", paragraphs: ["Run the CRA calculator before budgeting EU expansion or enterprise RFPs."] },
      ],
      faq: [
        { question: "FDA or SEC overlap?", answer: "Different regimes; CRA is product cybersecurity for EU market." },
        { question: "Timeline?", answer: "Track 2026 reporting and 2027 full application dates." },
        { question: "Evidence?", answer: "Combine calculator output with SAST/SCA pipelines." },
        { question: "Support?", answer: "Contact Sprita iT via sprita-it.com." },
      ],
      references: [{ label: "EU CRA", url: "https://digital-strategy.ec.europa.eu/en/policies/cra-summary" }],
    },
    "pt:pt": {
      h1: "Guia: conformidade com o EU Cyber Resilience Act",
      metaTitle: "Guia CRA | SpritaScore",
      metaDescription: "Requisitos CRA, SBOM e gestão de vulnerabilidades com calculadora SpritaScore.",
      summary: "O CRA define regras de cibersegurança para produtos com elementos digitais no mercado da UE.",
      sections: [
        { heading: "Requisitos", paragraphs: ["Segurança por design, gestão de vulnerabilidades e documentação técnica."] },
        { heading: "Prazos", paragraphs: ["Reporte de exploração ativa em 2026; conformidade alargada em 2027."] },
        { heading: "SpritaScore", paragraphs: ["Avalie lacunas e custos de remediação com a calculadora CRA."] },
      ],
      faq: [
        { question: "Aplica-se no Brasil?", answer: "Quando coloca produtos no mercado UE, sim." },
        { question: "SBOM?", answer: "Inventário de componentes exigido no ciclo de vida." },
        { question: "Auditoria?", answer: "A calculadora não substitui organismo notificado." },
        { question: "Sprita iT?", answer: "Serviços de segurança em sprita-it.com." },
      ],
      references: [{ label: "EU CRA", url: "https://digital-strategy.ec.europa.eu/en/policies/cra-summary" }],
    },
  },
  "dora-ict-resilience": {
    "es:es": {
      h1: "Guía: gestión de riesgos TIC bajo DORA",
      metaTitle: "Guía DORA — Resiliencia operativa digital | SpritaScore",
      metaDescription: "Marco DORA, pruebas de resiliencia, proveedores TIC y evaluación SpritaScore.",
      summary: "DORA exige marco de riesgos TIC, gestión de incidentes, pruebas de resiliencia y gobierno de proveedores críticos.",
      sections: [
        { heading: "Ámbito", paragraphs: ["Entidades financieras UE y proveedores TIC críticos.", "Aplicable desde enero 2025."] },
        { heading: "Controles clave", paragraphs: ["Inventario de activos, respuesta a incidentes, TLPT y contratos con cláusulas de resiliencia."] },
        { heading: "Calculadora DORA SpritaScore", paragraphs: ["15 preguntas, escala 1–5, diagnóstico de madurez y recomendaciones SAST/DAST/SCA."] },
      ],
      faq: [
        { question: "¿Solo bancos?", answer: "Incluye seguros, pagos, activos y proveedores TIC críticos." },
        { question: "¿Sustituye auditoría?", answer: "No; es autoevaluación orientativa." },
        { question: "¿Pruebas de penetración?", answer: "DORA espera pruebas regulares en sistemas críticos." },
        { question: "¿Sprita iT?", answer: "Marca detrás de SpritaScore — sprita-it.com." },
      ],
      references: [
        { label: "DORA — EIOPA", url: "https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en" },
        { label: "Calculadora DORA", url: "https://spritascore.com/es-es/calculadoras/dora-riesgo-tic" },
      ],
    },
    "en:eu": {
      h1: "Guide: DORA ICT risk management",
      metaTitle: "DORA ICT resilience guide | SpritaScore",
      metaDescription: "Digital Operational Resilience Act pillars and SpritaScore maturity assessment.",
      summary: "DORA harmonizes ICT risk requirements for EU financial entities and critical ICT third-party providers.",
      sections: [
        { heading: "Five pillars", paragraphs: ["ICT risk management, incident reporting, resilience testing, third-party risk, information sharing."] },
        { heading: "Testing", paragraphs: ["Vulnerability scanning and advanced penetration testing on critical systems with documented remediation."] },
        { heading: "SpritaScore", paragraphs: ["15-question assessment with maturity score and financial exposure estimate."] },
      ],
      faq: [
        { question: "ICT third-party providers?", answer: "Critical providers face direct oversight and contractual duties." },
        { question: "vs NIS2?", answer: "Complementary; financial sector has DORA-specific depth." },
        { question: "Code security?", answer: "SAST/DAST/SCA support resilience testing evidence." },
        { question: "Help?", answer: "Sprita iT technical diagnosis." },
      ],
      references: [{ label: "DORA", url: "https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en" }],
    },
    "en:us": {
      h1: "Guide: DORA implications for US firms serving EU finance",
      metaTitle: "DORA guide for US ICT providers | SpritaScore",
      metaDescription: "How US technology vendors should read DORA when serving EU financial institutions.",
      summary: "US cloud and software vendors may qualify as ICT third-party service providers under DORA when serving EU financial entities.",
      sections: [
        { heading: "Contractual pressure", paragraphs: ["EU buyers require resilience clauses, exit plans and audit rights."] },
        { heading: "Operational evidence", paragraphs: ["Document testing, incident response and secure SDLC practices."] },
        { heading: "Assessment", paragraphs: ["Use SpritaScore DORA calculator to baseline maturity before RFPs."] },
      ],
      faq: [
        { question: "Direct supervision?", answer: "Critical providers may face EU oversight." },
        { question: "SOC 2 enough?", answer: "Helpful but DORA expects ICT-specific resilience measures." },
        { question: "Calculator?", answer: "15-question maturity model on SpritaScore." },
        { question: "Sprita iT?", answer: "sprita-it.com" },
      ],
      references: [{ label: "DORA", url: "https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en" }],
    },
    "pt:pt": {
      h1: "Guia: resiliência operacional digital (DORA)",
      metaTitle: "Guia DORA | SpritaScore",
      metaDescription: "Gestão de riscos TIC, incidentes e testes de resiliência com avaliação SpritaScore.",
      summary: "O DORA harmoniza requisitos de resiliência digital para entidades financeiras na UE.",
      sections: [
        { heading: "Pilares", paragraphs: ["Gestão de riscos, incidentes, testes, terceiros e partilha de informação."] },
        { heading: "Testes", paragraphs: ["Varreduras e testes de intrusão com remediação documentada."] },
        { heading: "SpritaScore", paragraphs: ["Avaliação de 15 perguntas com diagnóstico de maturidade."] },
      ],
      faq: [
        { question: "Quem está sujeito?", answer: "Entidades financeiras e fornecedores TIC críticos." },
        { question: "Auditoria?", answer: "Autoevaliação; não substitui supervisão." },
        { question: "Código?", answer: "SAST/DAST/SCA alimentam evidências." },
        { question: "Sprita iT?", answer: "sprita-it.com" },
      ],
      references: [{ label: "DORA", url: "https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en" }],
    },
  },
  "nis2-application-security": {
    "es:es": {
      h1: "Guía: seguridad de aplicaciones y NIS2",
      metaTitle: "Guía NIS2 — Seguridad de aplicaciones | SpritaScore",
      metaDescription: "Relación entre NIS2, cadena de suministro de software y controles AppSec medibles con SpritaScore.",
      summary: "NIS2 refuerza ciberseguridad en sectores esenciales y cadena de suministro. La seguridad de aplicaciones es evidencia clave.",
      sections: [
        { heading: "Alcance NIS2", paragraphs: ["Más sectores y obligaciones de gestión de riesgo, incidentes y seguridad en adquisiciones."] },
        { heading: "Aplicaciones", paragraphs: ["Desarrollo seguro, gestión de vulnerabilidades y pruebas alineadas a SSDLC."] },
        { heading: "SpritaScore", paragraphs: ["Use calculadoras OWASP, CRA y sector para cuantificar brechas y costos."] },
      ],
      faq: [
        { question: "¿NIS2 sustituye DORA?", answer: "No; sectores financieros pueden estar en ambos marcos." },
        { question: "¿Proveedores SaaS?", answer: "Deben demostrar controles a clientes NIS2." },
        { question: "¿Multas?", answer: "Significativas; use estimaciones para priorizar inversión." },
        { question: "¿Ayuda Sprita iT?", answer: "Diagnóstico técnico y servicios SAST/DAST/SCA." },
      ],
      references: [
        { label: "NIS2 Directive", url: "https://digital-strategy.ec.europa.eu/en/policies/nis2-directive" },
      ],
    },
    "en:eu": {
      h1: "Guide: NIS2 and application security",
      metaTitle: "NIS2 application security guide | SpritaScore",
      metaDescription: "Map application security controls to NIS2 risk management expectations.",
      summary: "NIS2 expands cybersecurity duties for essential and important entities across the EU.",
      sections: [
        { heading: "Risk management", paragraphs: ["Policies, incident handling, supply chain security and testing."] },
        { heading: "Software supply chain", paragraphs: ["SBOM, vulnerability handling and secure development align with CRA and customer audits."] },
        { heading: "Quantify with SpritaScore", paragraphs: ["Sector, OWASP and CRA calculators produce executive-ready numbers."] },
      ],
      faq: [
        { question: "Entity classification?", answer: "Determine if you are essential/important in your member state." },
        { question: "vs CRA?", answer: "CRA is product-focused; NIS2 is entity-wide resilience." },
        { question: "Evidence?", answer: "Combine policies, scan results and SpritaScore reports." },
        { question: "Sprita iT?", answer: "sprita-it.com" },
      ],
      references: [{ label: "NIS2", url: "https://digital-strategy.ec.europa.eu/en/policies/nis2-directive" }],
    },
    "en:us": {
      h1: "Guide: NIS2 impact on US suppliers to EU essential entities",
      metaTitle: "NIS2 supply chain guide | SpritaScore",
      metaDescription: "How US software vendors should respond to NIS2-driven security questionnaires.",
      summary: "EU essential entities pass NIS2 expectations to software and cloud suppliers.",
      sections: [
        { heading: "Due diligence", paragraphs: ["Expect deeper AppSec evidence in enterprise procurement."] },
        { heading: "Controls", paragraphs: ["Vulnerability management, access control and incident notification clauses."] },
        { heading: "SpritaScore", paragraphs: ["Baseline cost of gaps before contract negotiations."] },
      ],
      faq: [
        { question: "Direct NIS2 scope?", answer: "US entities may be indirect via supply chain." },
        { question: "OWASP mapping?", answer: "Use OWASP calculator for web exposure scenarios." },
        { question: "Documentation?", answer: "Keep methodology pages and scan reports." },
        { question: "Contact?", answer: "info@spritascore.com / Sprita iT." },
      ],
      references: [{ label: "NIS2", url: "https://digital-strategy.ec.europa.eu/en/policies/nis2-directive" }],
    },
    "pt:pt": {
      h1: "Guia: NIS2 e segurança de aplicações",
      metaTitle: "Guia NIS2 | SpritaScore",
      metaDescription: "NIS2, cadeia de fornecimento e controlos AppSec com SpritaScore.",
      summary: "A diretiva NIS2 reforça cibersegurança para entidades essenciais na UE.",
      sections: [
        { heading: "Gestão de risco", paragraphs: ["Políticas, incidentes e segurança na cadeia de fornecimento."] },
        { heading: "Software", paragraphs: ["Desenvolvimento seguro e gestão de vulnerabilidades."] },
        { heading: "SpritaScore", paragraphs: ["Calculadoras OWASP e CRA para quantificar exposição."] },
      ],
      faq: [
        { question: "Portugal?", answer: "Transposição nacional define entidades abrangidas." },
        { question: "DORA?", answer: "Complementar no setor financeiro." },
        { question: "Evidências?", answer: "Relatórios SpritaScore + scans." },
        { question: "Sprita iT?", answer: "sprita-it.com" },
      ],
      references: [{ label: "NIS2", url: "https://digital-strategy.ec.europa.eu/en/policies/nis2-directive" }],
    },
  },
};

function marketForRegion(region: string): Market {
  if (region === "en-us") return "us";
  if (region === "en-eu") return "eu";
  if (region === "pt-pt") return "pt";
  return "es";
}

export function getGuideContent(slug: GuideSlug, locale: Locale, market?: Market): SeoGuideContent | null {
  const m = market ?? (locale === "en" ? "eu" : locale === "pt" ? "pt" : "es");
  const key = `${locale}:${m}` as `${Locale}:${Market}`;
  return GUIDES[slug]?.[key] ?? null;
}

export function getGuideContentForRegion(slug: GuideSlug, region: string): SeoGuideContent | null {
  const locale = region === "pt-pt" ? "pt" : region.startsWith("en") ? "en" : "es";
  return getGuideContent(slug, locale, marketForRegion(region));
}