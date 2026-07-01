export interface SectorConfig {
  id: string;
  name: string;
  multiplier: number;
  regulations: string[];
  recommendations: string[];
}

export const SECTOR_RISK_FACTORS: SectorConfig[] = [
  { id: "banca", name: "Banca", multiplier: 2.5, regulations: ["PCI DSS", "SOX", "Basel III"], recommendations: ["Priorizar controles de acceso, cifrado, monitoreo y trazabilidad.", "Fortalecer SAST, SCA, SBOM y gobierno de dependencias.", "Crear evidencia técnica para auditorías."] },
  { id: "fintech", name: "Fintech", multiplier: 2.3, regulations: ["PCI DSS", "GDPR", "LGPD"], recommendations: ["Priorizar controles de acceso, cifrado, monitoreo y trazabilidad.", "Fortalecer SAST, SCA, SBOM y gobierno de dependencias.", "Crear evidencia técnica para auditorías."] },
  { id: "salud", name: "Salud", multiplier: 2.4, regulations: ["HIPAA", "GDPR"], recommendations: ["Priorizar protección de datos sensibles, privacidad, trazabilidad y control de accesos.", "Reducir exposición de APIs y sistemas legacy."] },
  { id: "seguros", name: "Seguros", multiplier: 2.0, regulations: ["GDPR", "SOX"], recommendations: ["Fortalecer controles de acceso y protección de datos de clientes.", "Implementar monitoreo continuo de aplicaciones críticas."] },
  { id: "gobierno", name: "Gobierno", multiplier: 2.2, regulations: ["NIS2", "Regulación local"], recommendations: ["Priorizar continuidad operativa, evidencia documental, hardening y trazabilidad."] },
  { id: "educacion", name: "Educación", multiplier: 1.7, regulations: ["GDPR", "COPPA"], recommendations: ["Proteger datos de menores y credenciales de acceso.", "Reforzar controles en plataformas educativas expuestas."] },
  { id: "retail", name: "Retail", multiplier: 1.8, regulations: ["PCI DSS", "GDPR"], recommendations: ["Priorizar seguridad en pagos, sesiones, APIs, dependencias y configuración cloud."] },
  { id: "ecommerce", name: "E-commerce", multiplier: 2.0, regulations: ["PCI DSS", "GDPR"], recommendations: ["Priorizar seguridad en pagos, sesiones, APIs, dependencias y configuración cloud."] },
  { id: "saas-b2b", name: "SaaS B2B", multiplier: 1.9, regulations: ["GDPR", "SOC 2"], recommendations: ["Priorizar seguridad multi-tenant, dependencias, secretos, CI/CD y monitoreo."] },
  { id: "telecomunicaciones", name: "Telecomunicaciones", multiplier: 2.2, regulations: ["NIS2", "GDPR"], recommendations: ["Fortalecer infraestructura crítica y monitoreo de amenazas."] },
  { id: "energia", name: "Energía", multiplier: 2.5, regulations: ["NIS2", "IEC 62443"], recommendations: ["Proteger OT/IT y sistemas de control industrial.", "Implementar segmentación de red y monitoreo continuo."] },
  { id: "manufactura", name: "Manufactura", multiplier: 1.8, regulations: ["ISO 27001"], recommendations: ["Integrar seguridad en sistemas de producción y supply chain digital."] },
  { id: "logistica", name: "Logística", multiplier: 1.7, regulations: ["GDPR"], recommendations: ["Proteger datos de rastreo y APIs de integración logística."] },
  { id: "turismo", name: "Turismo / Hospitality", multiplier: 1.6, regulations: ["GDPR", "PCI DSS"], recommendations: ["Proteger datos de reservas y pagos en línea.", "Reforzar seguridad en integraciones con terceros."] },
  { id: "bpo", name: "BPO / Call centers", multiplier: 2.0, regulations: ["GDPR", "PCI DSS"], recommendations: ["Controlar acceso a datos de clientes y grabaciones.", "Implementar DLP y monitoreo de accesos privilegiados."] },
  { id: "farmaceutica", name: "Farmacéutica", multiplier: 2.3, regulations: ["HIPAA", "GDPR", "21 CFR Part 11"], recommendations: ["Proteger datos clínicos y propiedad intelectual.", "Asegurar trazabilidad en sistemas de I+D."] },
  { id: "sports-tech", name: "Sports tech", multiplier: 1.8, regulations: ["GDPR"], recommendations: ["Proteger datos biométricos y de rendimiento de atletas."] },
  { id: "adtech", name: "Adtech / Data brokers", multiplier: 2.4, regulations: ["GDPR", "CCPA"], recommendations: ["Implementar controles de privacidad y consentimiento.", "Minimizar exposición de datos agregados."] },
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