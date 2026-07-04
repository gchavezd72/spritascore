export const COUNTRIES = [
  { value: "MX", label: { es: "México", en: "Mexico", pt: "México" } },
  { value: "US", label: { es: "Estados Unidos", en: "United States", pt: "Estados Unidos" } },
  { value: "CO", label: { es: "Colombia", en: "Colombia", pt: "Colômbia" } },
  { value: "BR", label: { es: "Brasil", en: "Brazil", pt: "Brasil" } },
  { value: "AR", label: { es: "Argentina", en: "Argentina", pt: "Argentina" } },
  { value: "CL", label: { es: "Chile", en: "Chile", pt: "Chile" } },
  { value: "PE", label: { es: "Perú", en: "Peru", pt: "Peru" } },
  { value: "EC", label: { es: "Ecuador", en: "Ecuador", pt: "Equador" } },
  { value: "ES", label: { es: "España", en: "Spain", pt: "Espanha" } },
  { value: "PT", label: { es: "Portugal", en: "Portugal", pt: "Portugal" } },
  { value: "DE", label: { es: "Alemania", en: "Germany", pt: "Alemanha" } },
  { value: "FR", label: { es: "Francia", en: "France", pt: "França" } },
  { value: "IT", label: { es: "Italia", en: "Italy", pt: "Itália" } },
  { value: "UY", label: { es: "Uruguay", en: "Uruguay", pt: "Uruguai" } },
  { value: "CR", label: { es: "Costa Rica", en: "Costa Rica", pt: "Costa Rica" } },
  { value: "PA", label: { es: "Panamá", en: "Panama", pt: "Panamá" } },
];

export const COMPANY_SIZES = [
  { value: "startup", label: { es: "Startup (< 50 empleados)", en: "Startup (< 50 employees)", pt: "Startup (< 50 funcionários)" } },
  { value: "pyme", label: { es: "PYME (50-250 empleados)", en: "SMB (50-250 employees)", pt: "PME (50-250 funcionários)" } },
  { value: "mediana", label: { es: "Mediana (250-1000 empleados)", en: "Mid-size (250-1000 employees)", pt: "Média (250-1000 funcionários)" } },
  { value: "grande", label: { es: "Grande (1000+ empleados)", en: "Large (1000+ employees)", pt: "Grande (1000+ funcionários)" } },
  { value: "enterprise", label: { es: "Enterprise (5000+ empleados)", en: "Enterprise (5000+ employees)", pt: "Enterprise (5000+ funcionários)" } },
];

export const DEPENDENCY_LEVELS = [
  { value: "bajo", label: { es: "Bajo", en: "Low", pt: "Baixo" } },
  { value: "medio", label: { es: "Medio", en: "Medium", pt: "Médio" } },
  { value: "alto", label: { es: "Alto", en: "High", pt: "Alto" } },
  { value: "critico", label: { es: "Crítico", en: "Critical", pt: "Crítico" } },
];

export const APP_TYPES = [
  { value: "web", label: { es: "Web", en: "Web", pt: "Web" } },
  { value: "mobile", label: { es: "Mobile", en: "Mobile", pt: "Mobile" } },
  { value: "api", label: { es: "API", en: "API", pt: "API" } },
  { value: "core-bancario", label: { es: "Core bancario/financiero", en: "Core banking/financial system", pt: "Core bancário/financeiro" } },
  { value: "erp-crm", label: { es: "ERP/CRM", en: "ERP/CRM", pt: "ERP/CRM" } },
  { value: "ecommerce", label: { es: "E-commerce", en: "E-commerce", pt: "E-commerce" } },
  { value: "legacy", label: { es: "Legacy", en: "Legacy", pt: "Legado" } },
  { value: "saas", label: { es: "SaaS", en: "SaaS", pt: "SaaS" } },
  { value: "otro", label: { es: "Otro", en: "Other", pt: "Outro" } },
];

export const LOC_OPTIONS = [
  { value: "<100k", label: { es: "Menos de 100K", en: "Less than 100K", pt: "Menos de 100K" } },
  { value: "100k-500k", label: { es: "100K a 500K", en: "100K to 500K", pt: "100K a 500K" } },
  { value: "500k-1m", label: { es: "500K a 1M", en: "500K to 1M", pt: "500K a 1M" } },
  { value: "1m-5m", label: { es: "1M a 5M", en: "1M to 5M", pt: "1M a 5M" } },
  { value: ">5m", label: { es: "Más de 5M", en: "More than 5M", pt: "Mais de 5M" } },
];

export const RELEASE_FREQUENCIES = [
  { value: "diario", label: { es: "Diario", en: "Daily", pt: "Diário" } },
  { value: "semanal", label: { es: "Semanal", en: "Weekly", pt: "Semanal" } },
  { value: "mensual", label: { es: "Mensual", en: "Monthly", pt: "Mensal" } },
  { value: "trimestral", label: { es: "Trimestral", en: "Quarterly", pt: "Trimestral" } },
  { value: "esporadico", label: { es: "Esporádico", en: "Sporadic", pt: "Esporádico" } },
];

export const DATA_TYPES = [
  { value: "personal", label: { es: "Datos personales", en: "Personal data", pt: "Dados pessoais" } },
  { value: "financial", label: { es: "Datos financieros", en: "Financial data", pt: "Dados financeiros" } },
  { value: "health", label: { es: "Datos de salud", en: "Health data", pt: "Dados de saúde" } },
  { value: "credentials", label: { es: "Credenciales", en: "Credentials", pt: "Credenciais" } },
  { value: "ip", label: { es: "Propiedad intelectual", en: "Intellectual property", pt: "Propriedade intelectual" } },
  { value: "minors", label: { es: "Datos de menores", en: "Minors' data", pt: "Dados de menores" } },
  { value: "internal", label: { es: "Datos internos", en: "Internal data", pt: "Dados internos" } },
];

export const EXPOSURE_LEVELS = [
  { value: "interna", label: { es: "Interna", en: "Internal", pt: "Interna" } },
  { value: "externa", label: { es: "Externa", en: "External", pt: "Externa" } },
  { value: "publica", label: { es: "Pública", en: "Public", pt: "Pública" } },
  { value: "api-publica", label: { es: "API pública", en: "Public API", pt: "API pública" } },
];

export const EXPLOITATION_LEVELS = [
  { value: "teorica", label: { es: "Teórica", en: "Theoretical", pt: "Teórica" } },
  { value: "detectada", label: { es: "Detectada internamente", en: "Detected internally", pt: "Detectada internamente" } },
  { value: "exploitable", label: { es: "Explotable", en: "Exploitable", pt: "Explorável" } },
  { value: "explotada", label: { es: "Explotada", en: "Exploited", pt: "Explorada" } },
  { value: "explotada-fuga", label: { es: "Explotada con fuga confirmada", en: "Exploited with confirmed data leak", pt: "Explorada com vazamento confirmado" } },
];

export const OPERATIONAL_IMPACT = [
  { value: "ninguna", label: { es: "Sin interrupción", en: "No disruption", pt: "Sem interrupção" } },
  { value: "degradacion", label: { es: "Degradación parcial", en: "Partial degradation", pt: "Degradação parcial" } },
  { value: "parcial", label: { es: "Interrupción parcial", en: "Partial outage", pt: "Interrupção parcial" } },
  { value: "total", label: { es: "Interrupción total", en: "Total outage", pt: "Interrupção total" } },
];

export const SECURITY_CONTROLS = [
  { value: "sast", label: { es: "SAST", en: "SAST", pt: "SAST" } },
  { value: "sca", label: { es: "SCA", en: "SCA", pt: "SCA" } },
  { value: "dast", label: { es: "DAST", en: "DAST", pt: "DAST" } },
  { value: "pentesting", label: { es: "Pentesting", en: "Penetration testing", pt: "Teste de penetração" } },
  { value: "waf", label: { es: "WAF", en: "WAF", pt: "WAF" } },
  { value: "siem", label: { es: "SIEM", en: "SIEM", pt: "SIEM" } },
  { value: "mfa", label: { es: "MFA", en: "MFA", pt: "MFA" } },
  { value: "sbom", label: { es: "SBOM", en: "SBOM", pt: "SBOM" } },
  { value: "secure-sdlc", label: { es: "Secure SDLC", en: "Secure SDLC", pt: "SDLC seguro" } },
  { value: "none", label: { es: "Ninguno / No sé", en: "None / Not sure", pt: "Nenhum / Não sei" } },
];

export const REGULATIONS = [
  { value: "gdpr", label: { es: "GDPR", en: "GDPR", pt: "GDPR" } },
  { value: "lgpd", label: { es: "LGPD", en: "LGPD", pt: "LGPD" } },
  { value: "hipaa", label: { es: "HIPAA", en: "HIPAA", pt: "HIPAA" } },
  { value: "pci-dss", label: { es: "PCI DSS", en: "PCI DSS", pt: "PCI DSS" } },
  { value: "sox", label: { es: "SOX", en: "SOX", pt: "SOX" } },
  { value: "nis2", label: { es: "NIS2", en: "NIS2", pt: "NIS2" } },
  { value: "dora", label: { es: "DORA", en: "DORA", pt: "DORA" } },
  { value: "local", label: { es: "Regulación local", en: "Local regulation", pt: "Regulamentação local" } },
  { value: "unknown", label: { es: "No estoy seguro", en: "Not sure", pt: "Não tenho certeza" } },
];

export const MATURITY_LEVELS = [
  { value: "inicial", label: { es: "Inicial", en: "Initial", pt: "Inicial" } },
  { value: "basico", label: { es: "Básico", en: "Basic", pt: "Básico" } },
  { value: "intermedio", label: { es: "Intermedio", en: "Intermediate", pt: "Intermediário" } },
  { value: "avanzado", label: { es: "Avanzado", en: "Advanced", pt: "Avançado" } },
  { value: "gestionado", label: { es: "Gestionado", en: "Managed", pt: "Gerenciado" } },
];

export const SECURITY_TOOL_TYPES = [
  { value: "sast", label: { es: "SAST", en: "SAST", pt: "SAST" } },
  { value: "dast", label: { es: "DAST", en: "DAST", pt: "DAST" } },
  { value: "sca", label: { es: "SCA / dependencias", en: "SCA / dependencies", pt: "SCA / dependências" } },
  { value: "secrets", label: { es: "Detección de secretos", en: "Secrets detection", pt: "Detecção de segredos" } },
  { value: "cloud", label: { es: "Postura cloud (CSPM)", en: "Cloud security posture (CSPM)", pt: "Postura de segurança em nuvem (CSPM)" } },
  { value: "container", label: { es: "Contenedores", en: "Containers", pt: "Contêineres" } },
  { value: "pentest", label: { es: "Pentesting manual", en: "Manual penetration testing", pt: "Teste de penetração manual" } },
];

export const NOISE_LEVELS = [
  { value: "bajo", label: { es: "Bajo — menos de 20% son ruido", en: "Low — less than 20% is noise", pt: "Baixo — menos de 20% é ruído" } },
  { value: "medio", label: { es: "Medio — entre 20% y 50% son ruido", en: "Medium — between 20% and 50% is noise", pt: "Médio — entre 20% e 50% é ruído" } },
  { value: "alto", label: { es: "Alto — más de 50% son ruido", en: "High — more than 50% is noise", pt: "Alto — mais de 50% é ruído" } },
];

export const PRODUCT_CATEGORIES = [
  { value: "default", label: { es: "Producto por defecto (la mayoría del software)", en: "Default product (most software)", pt: "Produto padrão (a maioria do software)" } },
  { value: "importante", label: { es: "Producto importante (Anexo III — ej. gestores de identidad, firewalls, navegadores)", en: "Important product (Annex III — e.g. identity managers, firewalls, browsers)", pt: "Produto importante (Anexo III — ex.: gerenciadores de identidade, firewalls, navegadores)" } },
  { value: "critico", label: { es: "Producto crítico (Anexo IV — ej. sistemas operativos, HSM, tarjetas inteligentes)", en: "Critical product (Annex IV — e.g. operating systems, HSMs, smart cards)", pt: "Produto crítico (Anexo IV — ex.: sistemas operacionais, HSMs, cartões inteligentes)" } },
];

export const YES_NO = [
  { value: "si", label: { es: "Sí", en: "Yes", pt: "Sim" } },
  { value: "no", label: { es: "No", en: "No", pt: "Não" } },
];

export const YES_NO_PARCIAL = [
  { value: "si", label: { es: "Sí", en: "Yes", pt: "Sim" } },
  { value: "parcial", label: { es: "Parcialmente", en: "Partially", pt: "Parcialmente" } },
  { value: "no", label: { es: "No", en: "No", pt: "Não" } },
];

export const CONFORMITY_STATUS = [
  { value: "si", label: { es: "Sí, completada", en: "Yes, completed", pt: "Sim, concluída" } },
  { value: "en-proceso", label: { es: "En proceso", en: "In progress", pt: "Em andamento" } },
  { value: "no", label: { es: "No iniciada", en: "Not started", pt: "Não iniciada" } },
];