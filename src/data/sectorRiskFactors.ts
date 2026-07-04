import type { LocalizedText } from "@/types/calculator";

export interface SectorConfig {
  id: string;
  name: LocalizedText;
  multiplier: number;
  regulations: string[];
  recommendations: LocalizedText[];
}

export const SECTOR_RISK_FACTORS: SectorConfig[] = [
  {
    id: "banca",
    name: { es: "Banca", en: "Banking" },
    multiplier: 2.5,
    regulations: ["PCI DSS", "SOX", "Basel III"],
    recommendations: [
      { es: "Priorizar controles de acceso, cifrado, monitoreo y trazabilidad.", en: "Prioritize access controls, encryption, monitoring, and traceability." },
      { es: "Fortalecer SAST, SCA, SBOM y gobierno de dependencias.", en: "Strengthen SAST, SCA, SBOM, and dependency governance." },
      { es: "Crear evidencia técnica para auditorías.", en: "Build technical evidence for audits." },
    ],
  },
  {
    id: "fintech",
    name: { es: "Fintech", en: "Fintech" },
    multiplier: 2.3,
    regulations: ["PCI DSS", "GDPR", "LGPD"],
    recommendations: [
      { es: "Priorizar controles de acceso, cifrado, monitoreo y trazabilidad.", en: "Prioritize access controls, encryption, monitoring, and traceability." },
      { es: "Fortalecer SAST, SCA, SBOM y gobierno de dependencias.", en: "Strengthen SAST, SCA, SBOM, and dependency governance." },
      { es: "Crear evidencia técnica para auditorías.", en: "Build technical evidence for audits." },
    ],
  },
  {
    id: "salud",
    name: { es: "Salud", en: "Healthcare" },
    multiplier: 2.4,
    regulations: ["HIPAA", "GDPR"],
    recommendations: [
      { es: "Priorizar protección de datos sensibles, privacidad, trazabilidad y control de accesos.", en: "Prioritize protection of sensitive data, privacy, traceability, and access control." },
      { es: "Reducir exposición de APIs y sistemas legacy.", en: "Reduce exposure of APIs and legacy systems." },
    ],
  },
  {
    id: "seguros",
    name: { es: "Seguros", en: "Insurance" },
    multiplier: 2.0,
    regulations: ["GDPR", "SOX"],
    recommendations: [
      { es: "Fortalecer controles de acceso y protección de datos de clientes.", en: "Strengthen access controls and protection of customer data." },
      { es: "Implementar monitoreo continuo de aplicaciones críticas.", en: "Implement continuous monitoring of critical applications." },
    ],
  },
  {
    id: "gobierno",
    name: { es: "Gobierno", en: "Government" },
    multiplier: 2.2,
    regulations: ["NIS2", "Regulación local"],
    recommendations: [
      { es: "Priorizar continuidad operativa, evidencia documental, hardening y trazabilidad.", en: "Prioritize operational continuity, documented evidence, hardening, and traceability." },
    ],
  },
  {
    id: "educacion",
    name: { es: "Educación", en: "Education" },
    multiplier: 1.7,
    regulations: ["GDPR", "COPPA"],
    recommendations: [
      { es: "Proteger datos de menores y credenciales de acceso.", en: "Protect minors' data and access credentials." },
      { es: "Reforzar controles en plataformas educativas expuestas.", en: "Reinforce controls on exposed educational platforms." },
    ],
  },
  {
    id: "retail",
    name: { es: "Retail", en: "Retail" },
    multiplier: 1.8,
    regulations: ["PCI DSS", "GDPR"],
    recommendations: [
      { es: "Priorizar seguridad en pagos, sesiones, APIs, dependencias y configuración cloud.", en: "Prioritize security in payments, sessions, APIs, dependencies, and cloud configuration." },
    ],
  },
  {
    id: "ecommerce",
    name: { es: "E-commerce", en: "E-commerce" },
    multiplier: 2.0,
    regulations: ["PCI DSS", "GDPR"],
    recommendations: [
      { es: "Priorizar seguridad en pagos, sesiones, APIs, dependencias y configuración cloud.", en: "Prioritize security in payments, sessions, APIs, dependencies, and cloud configuration." },
    ],
  },
  {
    id: "saas-b2b",
    name: { es: "SaaS B2B", en: "B2B SaaS" },
    multiplier: 1.9,
    regulations: ["GDPR", "SOC 2"],
    recommendations: [
      { es: "Priorizar seguridad multi-tenant, dependencias, secretos, CI/CD y monitoreo.", en: "Prioritize multi-tenant security, dependencies, secrets, CI/CD, and monitoring." },
    ],
  },
  {
    id: "telecomunicaciones",
    name: { es: "Telecomunicaciones", en: "Telecommunications" },
    multiplier: 2.2,
    regulations: ["NIS2", "GDPR"],
    recommendations: [
      { es: "Fortalecer infraestructura crítica y monitoreo de amenazas.", en: "Strengthen critical infrastructure and threat monitoring." },
    ],
  },
  {
    id: "energia",
    name: { es: "Energía", en: "Energy" },
    multiplier: 2.5,
    regulations: ["NIS2", "IEC 62443"],
    recommendations: [
      { es: "Proteger OT/IT y sistemas de control industrial.", en: "Protect OT/IT and industrial control systems." },
      { es: "Implementar segmentación de red y monitoreo continuo.", en: "Implement network segmentation and continuous monitoring." },
    ],
  },
  {
    id: "manufactura",
    name: { es: "Manufactura", en: "Manufacturing" },
    multiplier: 1.8,
    regulations: ["ISO 27001"],
    recommendations: [
      { es: "Integrar seguridad en sistemas de producción y supply chain digital.", en: "Integrate security into production systems and the digital supply chain." },
    ],
  },
  {
    id: "logistica",
    name: { es: "Logística", en: "Logistics" },
    multiplier: 1.7,
    regulations: ["GDPR"],
    recommendations: [
      { es: "Proteger datos de rastreo y APIs de integración logística.", en: "Protect tracking data and logistics integration APIs." },
    ],
  },
  {
    id: "turismo",
    name: { es: "Turismo / Hospitality", en: "Travel / Hospitality" },
    multiplier: 1.6,
    regulations: ["GDPR", "PCI DSS"],
    recommendations: [
      { es: "Proteger datos de reservas y pagos en línea.", en: "Protect booking data and online payments." },
      { es: "Reforzar seguridad en integraciones con terceros.", en: "Reinforce security in third-party integrations." },
    ],
  },
  {
    id: "bpo",
    name: { es: "BPO / Call centers", en: "BPO / Call Centers" },
    multiplier: 2.0,
    regulations: ["GDPR", "PCI DSS"],
    recommendations: [
      { es: "Controlar acceso a datos de clientes y grabaciones.", en: "Control access to customer data and call recordings." },
      { es: "Implementar DLP y monitoreo de accesos privilegiados.", en: "Implement DLP and privileged access monitoring." },
    ],
  },
  {
    id: "farmaceutica",
    name: { es: "Farmacéutica", en: "Pharmaceutical" },
    multiplier: 2.3,
    regulations: ["HIPAA", "GDPR", "21 CFR Part 11"],
    recommendations: [
      { es: "Proteger datos clínicos y propiedad intelectual.", en: "Protect clinical data and intellectual property." },
      { es: "Asegurar trazabilidad en sistemas de I+D.", en: "Ensure traceability in R&D systems." },
    ],
  },
  {
    id: "sports-tech",
    name: { es: "Sports tech", en: "Sports Tech" },
    multiplier: 1.8,
    regulations: ["GDPR"],
    recommendations: [
      { es: "Proteger datos biométricos y de rendimiento de atletas.", en: "Protect athletes' biometric and performance data." },
    ],
  },
  {
    id: "adtech",
    name: { es: "Adtech / Data brokers", en: "Adtech / Data Brokers" },
    multiplier: 2.4,
    regulations: ["GDPR", "CCPA"],
    recommendations: [
      { es: "Implementar controles de privacidad y consentimiento.", en: "Implement privacy and consent controls." },
      { es: "Minimizar exposición de datos agregados.", en: "Minimize exposure of aggregated data." },
    ],
  },
];

export const REGULATION_MULTIPLIERS: Record<string, number> = {
  gdpr: 1.8,
  lgpd: 1.7,
  hipaa: 2.0,
  "pci-dss": 1.9,
  sox: 1.6,
  nis2: 1.8,
  dora: 2.0,
  local: 1.4,
  unknown: 1.3,
};

export const MATURITY_MULTIPLIERS: Record<string, number> = {
  inicial: 2.0,
  basico: 1.6,
  intermedio: 1.2,
  avanzado: 0.9,
  gestionado: 0.7,
};

export const DATA_SENSITIVITY_MULTIPLIERS: Record<string, number> = {
  personal: 1.3,
  financial: 1.8,
  health: 2.0,
  credentials: 1.7,
  ip: 1.5,
  minors: 2.2,
  internal: 1.1,
};

export const EXPOSURE_MULTIPLIERS: Record<string, number> = {
  interna: 1.0,
  externa: 1.4,
  publica: 1.8,
  "api-publica": 2.0,
};

export function getSector(id: string): SectorConfig | undefined {
  return SECTOR_RISK_FACTORS.find((s) => s.id === id);
}

export const SECTOR_OPTIONS = SECTOR_RISK_FACTORS.map((s) => ({
  value: s.id,
  label: s.name,
}));
