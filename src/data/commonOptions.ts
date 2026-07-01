export const COUNTRIES = [
  { value: "MX", label: "México" },
  { value: "US", label: "Estados Unidos" },
  { value: "CO", label: "Colombia" },
  { value: "BR", label: "Brasil" },
  { value: "AR", label: "Argentina" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Perú" },
  { value: "EC", label: "Ecuador" },
  { value: "ES", label: "España" },
  { value: "PT", label: "Portugal" },
  { value: "DE", label: "Alemania" },
  { value: "FR", label: "Francia" },
  { value: "IT", label: "Italia" },
  { value: "UY", label: "Uruguay" },
  { value: "CR", label: "Costa Rica" },
  { value: "PA", label: "Panamá" },
];

export const COMPANY_SIZES = [
  { value: "startup", label: "Startup (< 50 empleados)" },
  { value: "pyme", label: "PYME (50-250 empleados)" },
  { value: "mediana", label: "Mediana (250-1000 empleados)" },
  { value: "grande", label: "Grande (1000+ empleados)" },
  { value: "enterprise", label: "Enterprise (5000+ empleados)" },
];

export const DEPENDENCY_LEVELS = [
  { value: "bajo", label: "Bajo" },
  { value: "medio", label: "Medio" },
  { value: "alto", label: "Alto" },
  { value: "critico", label: "Crítico" },
];

export const APP_TYPES = [
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "api", label: "API" },
  { value: "core-bancario", label: "Core bancario/financiero" },
  { value: "erp-crm", label: "ERP/CRM" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "legacy", label: "Legacy" },
  { value: "saas", label: "SaaS" },
  { value: "otro", label: "Otro" },
];

export const LOC_OPTIONS = [
  { value: "<100k", label: "Menos de 100K" },
  { value: "100k-500k", label: "100K a 500K" },
  { value: "500k-1m", label: "500K a 1M" },
  { value: "1m-5m", label: "1M a 5M" },
  { value: ">5m", label: "Más de 5M" },
];

export const RELEASE_FREQUENCIES = [
  { value: "diario", label: "Diario" },
  { value: "semanal", label: "Semanal" },
  { value: "mensual", label: "Mensual" },
  { value: "trimestral", label: "Trimestral" },
  { value: "esporadico", label: "Esporádico" },
];

export const DATA_TYPES = [
  { value: "personal", label: "Datos personales" },
  { value: "financial", label: "Datos financieros" },
  { value: "health", label: "Datos de salud" },
  { value: "credentials", label: "Credenciales" },
  { value: "ip", label: "Propiedad intelectual" },
  { value: "minors", label: "Datos de menores" },
  { value: "internal", label: "Datos internos" },
];

export const EXPOSURE_LEVELS = [
  { value: "interna", label: "Interna" },
  { value: "externa", label: "Externa" },
  { value: "publica", label: "Pública" },
  { value: "api-publica", label: "API pública" },
];

export const EXPLOITATION_LEVELS = [
  { value: "teorica", label: "Teórica" },
  { value: "detectada", label: "Detectada internamente" },
  { value: "exploitable", label: "Explotable" },
  { value: "explotada", label: "Explotada" },
  { value: "explotada-fuga", label: "Explotada con fuga confirmada" },
];

export const OPERATIONAL_IMPACT = [
  { value: "ninguna", label: "Sin interrupción" },
  { value: "degradacion", label: "Degradación parcial" },
  { value: "parcial", label: "Interrupción parcial" },
  { value: "total", label: "Interrupción total" },
];

export const SECURITY_CONTROLS = [
  { value: "sast", label: "SAST" },
  { value: "sca", label: "SCA" },
  { value: "dast", label: "DAST" },
  { value: "pentesting", label: "Pentesting" },
  { value: "waf", label: "WAF" },
  { value: "siem", label: "SIEM" },
  { value: "mfa", label: "MFA" },
  { value: "sbom", label: "SBOM" },
  { value: "secure-sdlc", label: "Secure SDLC" },
  { value: "none", label: "Ninguno / No sé" },
];

export const REGULATIONS = [
  { value: "gdpr", label: "GDPR" },
  { value: "lgpd", label: "LGPD" },
  { value: "hipaa", label: "HIPAA" },
  { value: "pci-dss", label: "PCI DSS" },
  { value: "sox", label: "SOX" },
  { value: "nis2", label: "NIS2" },
  { value: "dora", label: "DORA" },
  { value: "local", label: "Regulación local" },
  { value: "unknown", label: "No estoy seguro" },
];

export const MATURITY_LEVELS = [
  { value: "inicial", label: "Inicial" },
  { value: "basico", label: "Básico" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "gestionado", label: "Gestionado" },
];