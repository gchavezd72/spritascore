export const COUNTRIES = [
  { value: "MX", label: { es: "México", en: "Mexico" } },
  { value: "US", label: { es: "Estados Unidos", en: "United States" } },
  { value: "CO", label: { es: "Colombia", en: "Colombia" } },
  { value: "BR", label: { es: "Brasil", en: "Brazil" } },
  { value: "AR", label: { es: "Argentina", en: "Argentina" } },
  { value: "CL", label: { es: "Chile", en: "Chile" } },
  { value: "PE", label: { es: "Perú", en: "Peru" } },
  { value: "EC", label: { es: "Ecuador", en: "Ecuador" } },
  { value: "ES", label: { es: "España", en: "Spain" } },
  { value: "PT", label: { es: "Portugal", en: "Portugal" } },
  { value: "DE", label: { es: "Alemania", en: "Germany" } },
  { value: "FR", label: { es: "Francia", en: "France" } },
  { value: "IT", label: { es: "Italia", en: "Italy" } },
  { value: "UY", label: { es: "Uruguay", en: "Uruguay" } },
  { value: "CR", label: { es: "Costa Rica", en: "Costa Rica" } },
  { value: "PA", label: { es: "Panamá", en: "Panama" } },
];

export const COMPANY_SIZES = [
  { value: "startup", label: { es: "Startup (< 50 empleados)", en: "Startup (< 50 employees)" } },
  { value: "pyme", label: { es: "PYME (50-250 empleados)", en: "SMB (50-250 employees)" } },
  { value: "mediana", label: { es: "Mediana (250-1000 empleados)", en: "Mid-size (250-1000 employees)" } },
  { value: "grande", label: { es: "Grande (1000+ empleados)", en: "Large (1000+ employees)" } },
  { value: "enterprise", label: { es: "Enterprise (5000+ empleados)", en: "Enterprise (5000+ employees)" } },
];

export const DEPENDENCY_LEVELS = [
  { value: "bajo", label: { es: "Bajo", en: "Low" } },
  { value: "medio", label: { es: "Medio", en: "Medium" } },
  { value: "alto", label: { es: "Alto", en: "High" } },
  { value: "critico", label: { es: "Crítico", en: "Critical" } },
];

export const APP_TYPES = [
  { value: "web", label: { es: "Web", en: "Web" } },
  { value: "mobile", label: { es: "Mobile", en: "Mobile" } },
  { value: "api", label: { es: "API", en: "API" } },
  { value: "core-bancario", label: { es: "Core bancario/financiero", en: "Core banking/financial system" } },
  { value: "erp-crm", label: { es: "ERP/CRM", en: "ERP/CRM" } },
  { value: "ecommerce", label: { es: "E-commerce", en: "E-commerce" } },
  { value: "legacy", label: { es: "Legacy", en: "Legacy" } },
  { value: "saas", label: { es: "SaaS", en: "SaaS" } },
  { value: "otro", label: { es: "Otro", en: "Other" } },
];

export const LOC_OPTIONS = [
  { value: "<100k", label: { es: "Menos de 100K", en: "Less than 100K" } },
  { value: "100k-500k", label: { es: "100K a 500K", en: "100K to 500K" } },
  { value: "500k-1m", label: { es: "500K a 1M", en: "500K to 1M" } },
  { value: "1m-5m", label: { es: "1M a 5M", en: "1M to 5M" } },
  { value: ">5m", label: { es: "Más de 5M", en: "More than 5M" } },
];

export const RELEASE_FREQUENCIES = [
  { value: "diario", label: { es: "Diario", en: "Daily" } },
  { value: "semanal", label: { es: "Semanal", en: "Weekly" } },
  { value: "mensual", label: { es: "Mensual", en: "Monthly" } },
  { value: "trimestral", label: { es: "Trimestral", en: "Quarterly" } },
  { value: "esporadico", label: { es: "Esporádico", en: "Sporadic" } },
];

export const DATA_TYPES = [
  { value: "personal", label: { es: "Datos personales", en: "Personal data" } },
  { value: "financial", label: { es: "Datos financieros", en: "Financial data" } },
  { value: "health", label: { es: "Datos de salud", en: "Health data" } },
  { value: "credentials", label: { es: "Credenciales", en: "Credentials" } },
  { value: "ip", label: { es: "Propiedad intelectual", en: "Intellectual property" } },
  { value: "minors", label: { es: "Datos de menores", en: "Minors' data" } },
  { value: "internal", label: { es: "Datos internos", en: "Internal data" } },
];

export const EXPOSURE_LEVELS = [
  { value: "interna", label: { es: "Interna", en: "Internal" } },
  { value: "externa", label: { es: "Externa", en: "External" } },
  { value: "publica", label: { es: "Pública", en: "Public" } },
  { value: "api-publica", label: { es: "API pública", en: "Public API" } },
];

export const EXPLOITATION_LEVELS = [
  { value: "teorica", label: { es: "Teórica", en: "Theoretical" } },
  { value: "detectada", label: { es: "Detectada internamente", en: "Detected internally" } },
  { value: "exploitable", label: { es: "Explotable", en: "Exploitable" } },
  { value: "explotada", label: { es: "Explotada", en: "Exploited" } },
  { value: "explotada-fuga", label: { es: "Explotada con fuga confirmada", en: "Exploited with confirmed data leak" } },
];

export const OPERATIONAL_IMPACT = [
  { value: "ninguna", label: { es: "Sin interrupción", en: "No disruption" } },
  { value: "degradacion", label: { es: "Degradación parcial", en: "Partial degradation" } },
  { value: "parcial", label: { es: "Interrupción parcial", en: "Partial outage" } },
  { value: "total", label: { es: "Interrupción total", en: "Total outage" } },
];

export const SECURITY_CONTROLS = [
  { value: "sast", label: { es: "SAST", en: "SAST" } },
  { value: "sca", label: { es: "SCA", en: "SCA" } },
  { value: "dast", label: { es: "DAST", en: "DAST" } },
  { value: "pentesting", label: { es: "Pentesting", en: "Penetration testing" } },
  { value: "waf", label: { es: "WAF", en: "WAF" } },
  { value: "siem", label: { es: "SIEM", en: "SIEM" } },
  { value: "mfa", label: { es: "MFA", en: "MFA" } },
  { value: "sbom", label: { es: "SBOM", en: "SBOM" } },
  { value: "secure-sdlc", label: { es: "Secure SDLC", en: "Secure SDLC" } },
  { value: "none", label: { es: "Ninguno / No sé", en: "None / Not sure" } },
];

export const REGULATIONS = [
  { value: "gdpr", label: { es: "GDPR", en: "GDPR" } },
  { value: "lgpd", label: { es: "LGPD", en: "LGPD" } },
  { value: "hipaa", label: { es: "HIPAA", en: "HIPAA" } },
  { value: "pci-dss", label: { es: "PCI DSS", en: "PCI DSS" } },
  { value: "sox", label: { es: "SOX", en: "SOX" } },
  { value: "nis2", label: { es: "NIS2", en: "NIS2" } },
  { value: "dora", label: { es: "DORA", en: "DORA" } },
  { value: "local", label: { es: "Regulación local", en: "Local regulation" } },
  { value: "unknown", label: { es: "No estoy seguro", en: "Not sure" } },
];

export const MATURITY_LEVELS = [
  { value: "inicial", label: { es: "Inicial", en: "Initial" } },
  { value: "basico", label: { es: "Básico", en: "Basic" } },
  { value: "intermedio", label: { es: "Intermedio", en: "Intermediate" } },
  { value: "avanzado", label: { es: "Avanzado", en: "Advanced" } },
  { value: "gestionado", label: { es: "Gestionado", en: "Managed" } },
];

export const SECURITY_TOOL_TYPES = [
  { value: "sast", label: { es: "SAST", en: "SAST" } },
  { value: "dast", label: { es: "DAST", en: "DAST" } },
  { value: "sca", label: { es: "SCA / dependencias", en: "SCA / dependencies" } },
  { value: "secrets", label: { es: "Detección de secretos", en: "Secrets detection" } },
  { value: "cloud", label: { es: "Postura cloud (CSPM)", en: "Cloud security posture (CSPM)" } },
  { value: "container", label: { es: "Contenedores", en: "Containers" } },
  { value: "pentest", label: { es: "Pentesting manual", en: "Manual penetration testing" } },
];

export const NOISE_LEVELS = [
  { value: "bajo", label: { es: "Bajo — menos de 20% son ruido", en: "Low — less than 20% is noise" } },
  { value: "medio", label: { es: "Medio — entre 20% y 50% son ruido", en: "Medium — between 20% and 50% is noise" } },
  { value: "alto", label: { es: "Alto — más de 50% son ruido", en: "High — more than 50% is noise" } },
];

export const PRODUCT_CATEGORIES = [
  { value: "default", label: { es: "Producto por defecto (la mayoría del software)", en: "Default product (most software)" } },
  { value: "importante", label: { es: "Producto importante (Anexo III — ej. gestores de identidad, firewalls, navegadores)", en: "Important product (Annex III — e.g. identity managers, firewalls, browsers)" } },
  { value: "critico", label: { es: "Producto crítico (Anexo IV — ej. sistemas operativos, HSM, tarjetas inteligentes)", en: "Critical product (Annex IV — e.g. operating systems, HSMs, smart cards)" } },
];

export const YES_NO = [
  { value: "si", label: { es: "Sí", en: "Yes" } },
  { value: "no", label: { es: "No", en: "No" } },
];

export const YES_NO_PARCIAL = [
  { value: "si", label: { es: "Sí", en: "Yes" } },
  { value: "parcial", label: { es: "Parcialmente", en: "Partially" } },
  { value: "no", label: { es: "No", en: "No" } },
];

export const CONFORMITY_STATUS = [
  { value: "si", label: { es: "Sí, completada", en: "Yes, completed" } },
  { value: "en-proceso", label: { es: "En proceso", en: "In progress" } },
  { value: "no", label: { es: "No iniciada", en: "Not started" } },
];
