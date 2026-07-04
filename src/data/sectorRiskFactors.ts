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
    name: { es: "Banca", en: "Banking", pt: "Bancos" },
    multiplier: 2.5,
    regulations: ["PCI DSS", "SOX", "Basel III"],
    recommendations: [
      { es: "Priorizar controles de acceso, cifrado, monitoreo y trazabilidad.", en: "Prioritize access controls, encryption, monitoring, and traceability.", pt: "Priorizar controles de acesso, criptografia, monitoramento e rastreabilidade." },
      { es: "Fortalecer SAST, SCA, SBOM y gobierno de dependencias.", en: "Strengthen SAST, SCA, SBOM, and dependency governance.", pt: "Fortalecer SAST, SCA, SBOM e governança de dependências." },
      { es: "Crear evidencia técnica para auditorías.", en: "Build technical evidence for audits.", pt: "Criar evidências técnicas para auditorias." },
    ],
  },
  {
    id: "fintech",
    name: { es: "Fintech", en: "Fintech", pt: "Fintech" },
    multiplier: 2.3,
    regulations: ["PCI DSS", "GDPR", "LGPD"],
    recommendations: [
      { es: "Priorizar controles de acceso, cifrado, monitoreo y trazabilidad.", en: "Prioritize access controls, encryption, monitoring, and traceability.", pt: "Priorizar controles de acesso, criptografia, monitoramento e rastreabilidade." },
      { es: "Fortalecer SAST, SCA, SBOM y gobierno de dependencias.", en: "Strengthen SAST, SCA, SBOM, and dependency governance.", pt: "Fortalecer SAST, SCA, SBOM e governança de dependências." },
      { es: "Crear evidencia técnica para auditorías.", en: "Build technical evidence for audits.", pt: "Criar evidências técnicas para auditorias." },
    ],
  },
  {
    id: "salud",
    name: { es: "Salud", en: "Healthcare", pt: "Saúde" },
    multiplier: 2.4,
    regulations: ["HIPAA", "GDPR"],
    recommendations: [
      { es: "Priorizar protección de datos sensibles, privacidad, trazabilidad y control de accesos.", en: "Prioritize protection of sensitive data, privacy, traceability, and access control.", pt: "Priorizar proteção de dados sensíveis, privacidade, rastreabilidade e controle de acesso." },
      { es: "Reducir exposición de APIs y sistemas legacy.", en: "Reduce exposure of APIs and legacy systems.", pt: "Reduzir a exposição de APIs e sistemas legados." },
    ],
  },
  {
    id: "seguros",
    name: { es: "Seguros", en: "Insurance", pt: "Seguros" },
    multiplier: 2.0,
    regulations: ["GDPR", "SOX"],
    recommendations: [
      { es: "Fortalecer controles de acceso y protección de datos de clientes.", en: "Strengthen access controls and protection of customer data.", pt: "Fortalecer controles de acesso e proteção de dados de clientes." },
      { es: "Implementar monitoreo continuo de aplicaciones críticas.", en: "Implement continuous monitoring of critical applications.", pt: "Implementar monitoramento contínuo de aplicações críticas." },
    ],
  },
  {
    id: "gobierno",
    name: { es: "Gobierno", en: "Government", pt: "Governo" },
    multiplier: 2.2,
    regulations: ["NIS2", "Regulación local"],
    recommendations: [
      { es: "Priorizar continuidad operativa, evidencia documental, hardening y trazabilidad.", en: "Prioritize operational continuity, documented evidence, hardening, and traceability.", pt: "Priorizar continuidade operacional, evidências documentais, hardening e rastreabilidade." },
    ],
  },
  {
    id: "educacion",
    name: { es: "Educación", en: "Education", pt: "Educação" },
    multiplier: 1.7,
    regulations: ["GDPR", "COPPA"],
    recommendations: [
      { es: "Proteger datos de menores y credenciales de acceso.", en: "Protect minors' data and access credentials.", pt: "Proteger dados de menores e credenciais de acesso." },
      { es: "Reforzar controles en plataformas educativas expuestas.", en: "Reinforce controls on exposed educational platforms.", pt: "Reforçar controles em plataformas educacionais expostas." },
    ],
  },
  {
    id: "retail",
    name: { es: "Retail", en: "Retail", pt: "Varejo" },
    multiplier: 1.8,
    regulations: ["PCI DSS", "GDPR"],
    recommendations: [
      { es: "Priorizar seguridad en pagos, sesiones, APIs, dependencias y configuración cloud.", en: "Prioritize security in payments, sessions, APIs, dependencies, and cloud configuration.", pt: "Priorizar segurança em pagamentos, sessões, APIs, dependências e configuração em nuvem." },
    ],
  },
  {
    id: "ecommerce",
    name: { es: "E-commerce", en: "E-commerce", pt: "E-commerce" },
    multiplier: 2.0,
    regulations: ["PCI DSS", "GDPR"],
    recommendations: [
      { es: "Priorizar seguridad en pagos, sesiones, APIs, dependencias y configuración cloud.", en: "Prioritize security in payments, sessions, APIs, dependencies, and cloud configuration.", pt: "Priorizar segurança em pagamentos, sessões, APIs, dependências e configuração em nuvem." },
    ],
  },
  {
    id: "saas-b2b",
    name: { es: "SaaS B2B", en: "B2B SaaS", pt: "SaaS B2B" },
    multiplier: 1.9,
    regulations: ["GDPR", "SOC 2"],
    recommendations: [
      { es: "Priorizar seguridad multi-tenant, dependencias, secretos, CI/CD y monitoreo.", en: "Prioritize multi-tenant security, dependencies, secrets, CI/CD, and monitoring.", pt: "Priorizar segurança multi-tenant, dependências, segredos, CI/CD e monitoramento." },
    ],
  },
  {
    id: "telecomunicaciones",
    name: { es: "Telecomunicaciones", en: "Telecommunications", pt: "Telecomunicações" },
    multiplier: 2.2,
    regulations: ["NIS2", "GDPR"],
    recommendations: [
      { es: "Fortalecer infraestructura crítica y monitoreo de amenazas.", en: "Strengthen critical infrastructure and threat monitoring.", pt: "Fortalecer infraestrutura crítica e monitoramento de ameaças." },
    ],
  },
  {
    id: "energia",
    name: { es: "Energía", en: "Energy", pt: "Energia" },
    multiplier: 2.5,
    regulations: ["NIS2", "IEC 62443"],
    recommendations: [
      { es: "Proteger OT/IT y sistemas de control industrial.", en: "Protect OT/IT and industrial control systems.", pt: "Proteger OT/IT e sistemas de controle industrial." },
      { es: "Implementar segmentación de red y monitoreo continuo.", en: "Implement network segmentation and continuous monitoring.", pt: "Implementar segmentação de rede e monitoramento contínuo." },
    ],
  },
  {
    id: "manufactura",
    name: { es: "Manufactura", en: "Manufacturing", pt: "Manufatura" },
    multiplier: 1.8,
    regulations: ["ISO 27001"],
    recommendations: [
      { es: "Integrar seguridad en sistemas de producción y supply chain digital.", en: "Integrate security into production systems and the digital supply chain.", pt: "Integrar segurança em sistemas de produção e na cadeia de suprimentos digital." },
    ],
  },
  {
    id: "logistica",
    name: { es: "Logística", en: "Logistics", pt: "Logística" },
    multiplier: 1.7,
    regulations: ["GDPR"],
    recommendations: [
      { es: "Proteger datos de rastreo y APIs de integración logística.", en: "Protect tracking data and logistics integration APIs.", pt: "Proteger dados de rastreamento e APIs de integração logística." },
    ],
  },
  {
    id: "turismo",
    name: { es: "Turismo / Hospitality", en: "Travel / Hospitality", pt: "Turismo / Hospitalidade" },
    multiplier: 1.6,
    regulations: ["GDPR", "PCI DSS"],
    recommendations: [
      { es: "Proteger datos de reservas y pagos en línea.", en: "Protect booking data and online payments.", pt: "Proteger dados de reservas e pagamentos online." },
      { es: "Reforzar seguridad en integraciones con terceros.", en: "Reinforce security in third-party integrations.", pt: "Reforçar segurança em integrações com terceiros." },
    ],
  },
  {
    id: "bpo",
    name: { es: "BPO / Call centers", en: "BPO / Call Centers", pt: "BPO / Call centers" },
    multiplier: 2.0,
    regulations: ["GDPR", "PCI DSS"],
    recommendations: [
      { es: "Controlar acceso a datos de clientes y grabaciones.", en: "Control access to customer data and call recordings.", pt: "Controlar acesso a dados de clientes e gravações de chamadas." },
      { es: "Implementar DLP y monitoreo de accesos privilegiados.", en: "Implement DLP and privileged access monitoring.", pt: "Implementar DLP e monitoramento de acessos privilegiados." },
    ],
  },
  {
    id: "farmaceutica",
    name: { es: "Farmacéutica", en: "Pharmaceutical", pt: "Farmacêutica" },
    multiplier: 2.3,
    regulations: ["HIPAA", "GDPR", "21 CFR Part 11"],
    recommendations: [
      { es: "Proteger datos clínicos y propiedad intelectual.", en: "Protect clinical data and intellectual property.", pt: "Proteger dados clínicos e propriedade intelectual." },
      { es: "Asegurar trazabilidad en sistemas de I+D.", en: "Ensure traceability in R&D systems.", pt: "Garantir rastreabilidade em sistemas de P&D." },
    ],
  },
  {
    id: "sports-tech",
    name: { es: "Sports tech", en: "Sports Tech", pt: "Sports tech" },
    multiplier: 1.8,
    regulations: ["GDPR"],
    recommendations: [
      { es: "Proteger datos biométricos y de rendimiento de atletas.", en: "Protect athletes' biometric and performance data.", pt: "Proteger dados biométricos e de desempenho de atletas." },
    ],
  },
  {
    id: "adtech",
    name: { es: "Adtech / Data brokers", en: "Adtech / Data Brokers", pt: "Adtech / Data brokers" },
    multiplier: 2.4,
    regulations: ["GDPR", "CCPA"],
    recommendations: [
      { es: "Implementar controles de privacidad y consentimiento.", en: "Implement privacy and consent controls.", pt: "Implementar controles de privacidade e consentimento." },
      { es: "Minimizar exposición de datos agregados.", en: "Minimize exposure of aggregated data.", pt: "Minimizar a exposição de dados agregados." },
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