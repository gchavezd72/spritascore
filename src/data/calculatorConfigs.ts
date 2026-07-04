import { OWASP_TOP10_2021 } from "@/data/owaspTop10";
import { OWASP_MOBILE_TOP10_2024 } from "@/data/owaspMobileTop10";
import { ISO_25010_DIMENSIONS } from "@/data/isoQualityModel";
import { SECTOR_OPTIONS } from "@/data/sectorRiskFactors";
import {
  APP_TYPES,
  CONFORMITY_STATUS,
  COUNTRIES,
  DATA_TYPES,
  DEPENDENCY_LEVELS,
  EXPLOITATION_LEVELS,
  EXPOSURE_LEVELS,
  LOC_OPTIONS,
  MATURITY_LEVELS,
  NOISE_LEVELS,
  OPERATIONAL_IMPACT,
  PRODUCT_CATEGORIES,
  REGULATIONS,
  SECURITY_CONTROLS,
  SECURITY_TOOL_TYPES,
  YES_NO,
  YES_NO_PARCIAL,
} from "@/data/commonOptions";
import type { CalculatorConfig } from "@/types/calculator";

const CURRENCY_FIELD = {
  name: "currency",
  label: { es: "Moneda de reporte", en: "Report currency" },
  type: "select" as const,
  options: [
    { value: "USD", label: { es: "USD", en: "USD" } }, { value: "EUR", label: { es: "EUR", en: "EUR" } }, { value: "MXN", label: { es: "MXN", en: "MXN" } },
    { value: "BRL", label: { es: "BRL", en: "BRL" } }, { value: "COP", label: { es: "COP", en: "COP" } }, { value: "CLP", label: { es: "CLP", en: "CLP" } }, { value: "PEN", label: { es: "PEN", en: "PEN" } },
  ],
};

const CONFIRM_FIELD = {
  name: "confirmEstimate",
  label: { es: "Entiendo que los resultados son estimaciones orientativas", en: "I understand the results are indicative estimates" },
  type: "checkbox" as const,
  required: true,
};

export const CALCULATOR_CONFIGS: CalculatorConfig[] = [
  {
    id: "iso-quality",
    slug: "no-calidad-codigo",
    category: "calidad",
    title: { es: "Costo de no calidad en el código", en: "Cost of poor code quality" },
    shortDescription: { es: "Estima el costo anual de defectos, deuda técnica y baja mantenibilidad basado en ISO/IEC 25010.", en: "Estimates the annual cost of defects, technical debt, and low maintainability based on ISO/IEC 25010." },
    complexity: "alta",
    estimatedTime: { es: "2 a 3 minutos", en: "2 to 3 minutes" },
    steps: [
      {
        id: "context",
        title: { es: "Su contexto", en: "Your context" },
        description: { es: "Solo lo esencial para calibrar el resultado.", en: "Just the essentials to calibrate the result." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country" }, type: "select", options: COUNTRIES, required: true },
          { name: "softwareDependency", label: { es: "Dependencia del negocio del software", en: "Business dependency on software" }, type: "select", options: DEPENDENCY_LEVELS, tooltip: { es: "Qué tan crítico es el software para las operaciones del negocio.", en: "How critical the software is to business operations." }, required: true },
          { name: "appType", label: { es: "Tipo de aplicación principal", en: "Main application type" }, type: "select", options: APP_TYPES, required: true },
          { name: "codeAge", label: { es: "Antigüedad promedio del código (años)", en: "Average code age (years)" }, type: "number", placeholder: "3", required: true },
          { name: "linesOfCode", label: { es: "Líneas de código aproximadas", en: "Approximate lines of code" }, type: "select", options: LOC_OPTIONS, required: true },
        ],
      },
      {
        id: "team",
        title: { es: "Su equipo", en: "Your team" },
        description: { es: "Datos de esfuerzo dedicado a mantener el software.", en: "Data on effort dedicated to maintaining the software." },
        fields: [
          { name: "devCount", label: { es: "Número de desarrolladores", en: "Number of developers" }, type: "number", placeholder: "15", required: true },
          { name: "devMonthlyCost", label: { es: "Costo promedio mensual por desarrollador", en: "Average monthly cost per developer" }, type: "number", placeholder: "5000", tooltip: { es: "Salario + cargas + beneficios.", en: "Salary + payroll charges + benefits." }, required: true },
          { name: "bugHours", label: { es: "Horas semanales en corrección de bugs", en: "Weekly hours spent fixing bugs" }, type: "number", placeholder: "8", required: true },
          { name: "supportHours", label: { es: "Horas semanales en soporte por defectos", en: "Weekly hours spent on defect-related support" }, type: "number", placeholder: "4", required: true },
          { name: "reworkHours", label: { es: "Horas semanales en retrabajo", en: "Weekly hours spent on rework" }, type: "number", placeholder: "6", required: true },
          { name: "monthlyIncidents", label: { es: "Incidentes mensuales promedio", en: "Average monthly incidents" }, type: "number", placeholder: "3", required: true },
        ],
      },
      {
        id: "quality",
        title: { es: "Calidad de su código (ISO/IEC 25010)", en: "Your code quality (ISO/IEC 25010)" },
        description: { es: "Deslice cada indicador de 1 (muy deficiente) a 5 (excelente). Ya vienen en un punto medio, ajuste solo lo que sepa.", en: "Slide each indicator from 1 (very poor) to 5 (excellent). They start at a midpoint — adjust only what you know." },
        fields: ISO_25010_DIMENSIONS.map((dim) => ({
          name: dim.id,
          label: {
            es: `${dim.nameEs}${dim.iso9126Mapping ? ` (ISO 9126: ${dim.iso9126Mapping})` : ""}`,
            en: `${dim.name}${dim.iso9126Mapping ? ` (ISO 9126: ${dim.iso9126Mapping})` : ""}`,
          },
          type: "slider" as const,
          min: 1,
          max: 5,
          defaultValue: 3,
          tooltip: dim.description,
          required: true,
        })),
      },
      {
        id: "review",
        title: { es: "Confirmar y calcular", en: "Confirm and calculate" },
        description: { es: "Último paso: revise la moneda y confirme.", en: "Last step: review the currency and confirm." },
        fields: [CURRENCY_FIELD, CONFIRM_FIELD],
      },
    ],
  },
  {
    id: "owasp-web",
    slug: "owasp-top10-web",
    category: "seguridad",
    title: { es: "Costo de vulnerabilidad OWASP Top 10", en: "Cost of an OWASP Top 10 vulnerability" },
    shortDescription: { es: "Estima el impacto económico de una vulnerabilidad OWASP Top 10 2021 en aplicaciones web.", en: "Estimates the financial impact of an OWASP Top 10 2021 vulnerability in web applications." },
    complexity: "media",
    estimatedTime: { es: "2 a 3 minutos", en: "2 to 3 minutes" },
    steps: [
      {
        id: "context",
        title: { es: "Su contexto", en: "Your context" },
        description: { es: "Contexto organizacional mínimo.", en: "Minimal organizational context." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country" }, type: "select", options: COUNTRIES, required: true },
          { name: "softwareDependency", label: { es: "Dependencia del negocio del software", en: "Business dependency on software" }, type: "select", options: DEPENDENCY_LEVELS, required: true },
        ],
      },
      {
        id: "application",
        title: { es: "Su aplicación", en: "Your application" },
        description: { es: "Características de la aplicación web afectada.", en: "Characteristics of the affected web application." },
        fields: [
          { name: "appType", label: { es: "Tipo de aplicación", en: "Application type" }, type: "select", options: APP_TYPES, required: true },
          { name: "userCount", label: { es: "Número de usuarios", en: "Number of users" }, type: "number", placeholder: "50000", required: true },
          { name: "sensitiveRecords", label: { es: "Registros sensibles aproximados", en: "Approximate sensitive records" }, type: "number", placeholder: "100000", required: true },
          { name: "dataTypes", label: { es: "Tipos de datos procesados", en: "Types of data processed" }, type: "multiselect", options: DATA_TYPES, required: true },
          { name: "exposure", label: { es: "Nivel de exposición", en: "Exposure level" }, type: "select", options: EXPOSURE_LEVELS, required: true },
        ],
      },
      {
        id: "vulnerability",
        title: { es: "La vulnerabilidad", en: "The vulnerability" },
        description: { es: "Detalles específicos de la vulnerabilidad OWASP identificada.", en: "Specific details of the identified OWASP vulnerability." },
        fields: [
          { name: "owaspCategory", label: { es: "Categoría OWASP Top 10", en: "OWASP Top 10 category" }, type: "select", options: OWASP_TOP10_2021.map((c) => ({ value: c.id, label: { es: `${c.id}: ${c.nameEs}`, en: `${c.id}: ${c.name}` } })), required: true },
          { name: "environment", label: { es: "Ambiente afectado", en: "Affected environment" }, type: "select", options: [
            { value: "desarrollo", label: { es: "Desarrollo", en: "Development" } }, { value: "testing", label: { es: "Testing", en: "Testing" } }, { value: "produccion", label: { es: "Producción", en: "Production" } },
          ], required: true },
          { name: "exploitationLevel", label: { es: "Nivel de explotación", en: "Exploitation level" }, type: "select", options: EXPLOITATION_LEVELS, required: true },
          { name: "exposureDays", label: { es: "Tiempo estimado de exposición (días)", en: "Estimated exposure time (days)" }, type: "number", placeholder: "30", required: true },
          { name: "remediationDays", label: { es: "Tiempo estimado de remediación (días)", en: "Estimated remediation time (days)" }, type: "number", placeholder: "14", required: true },
        ],
      },
      {
        id: "economic",
        title: { es: "Impacto económico", en: "Financial impact" },
        description: { es: "Costos operativos y confirmación final.", en: "Operational costs and final confirmation." },
        fields: [
          { name: "hourlyRate", label: { es: "Costo promedio por hora del equipo técnico", en: "Average hourly cost of the technical team" }, type: "number", placeholder: "75", required: true },
          { name: "annualRevenue", label: { es: "Ingreso anual aproximado (USD)", en: "Approximate annual revenue (USD)" }, type: "number", placeholder: "5000000", required: true },
          { name: "operationalImpact", label: { es: "Impacto en operación", en: "Operational impact" }, type: "select", options: OPERATIONAL_IMPACT, required: true },
          CURRENCY_FIELD,
          CONFIRM_FIELD,
        ],
      },
    ],
  },
  {
    id: "owasp-mobile",
    slug: "owasp-mobile-top10",
    category: "seguridad",
    title: { es: "Costo de vulnerabilidad OWASP Mobile Top 10", en: "Cost of an OWASP Mobile Top 10 vulnerability" },
    shortDescription: { es: "Estima el impacto económico de vulnerabilidades en apps móviles según OWASP Mobile Top 10 2024.", en: "Estimates the financial impact of mobile app vulnerabilities according to the OWASP Mobile Top 10 2024." },
    complexity: "media",
    estimatedTime: { es: "2 a 3 minutos", en: "2 to 3 minutes" },
    steps: [
      {
        id: "context",
        title: { es: "Su contexto", en: "Your context" },
        description: { es: "Contexto organizacional mínimo.", en: "Minimal organizational context." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country" }, type: "select", options: COUNTRIES, required: true },
        ],
      },
      {
        id: "application",
        title: { es: "Su app móvil", en: "Your mobile app" },
        description: { es: "Características de la app móvil.", en: "Characteristics of the mobile app." },
        fields: [
          { name: "platform", label: { es: "Plataforma", en: "Platform" }, type: "select", options: [
            { value: "ios", label: { es: "iOS", en: "iOS" } }, { value: "android", label: { es: "Android", en: "Android" } }, { value: "ambas", label: { es: "Ambas", en: "Both" } },
          ], required: true },
          { name: "appType", label: { es: "Tipo de aplicación", en: "Application type" }, type: "select", options: [
            { value: "banca", label: { es: "Banca", en: "Banking" } }, { value: "fintech", label: { es: "Fintech", en: "Fintech" } }, { value: "salud", label: { es: "Salud", en: "Healthcare" } },
            { value: "retail", label: { es: "Retail", en: "Retail" } }, { value: "ecommerce", label: { es: "E-commerce", en: "E-commerce" } }, { value: "gobierno", label: { es: "Gobierno", en: "Government" } },
            { value: "educacion", label: { es: "Educación", en: "Education" } }, { value: "logistica", label: { es: "Logística", en: "Logistics" } }, { value: "saas", label: { es: "SaaS", en: "SaaS" } }, { value: "otra", label: { es: "Otra", en: "Other" } },
          ], required: true },
          { name: "activeUsers", label: { es: "Usuarios activos", en: "Active users" }, type: "number", placeholder: "50000", required: true },
          { name: "downloads", label: { es: "Número de descargas", en: "Number of downloads" }, type: "number", placeholder: "200000", required: true },
          { name: "hasPayments", label: { es: "¿Procesa pagos in-app?", en: "Does it process in-app payments?" }, type: "select", options: [
            { value: "si", label: { es: "Sí", en: "Yes" } }, { value: "no", label: { es: "No", en: "No" } },
          ], required: true },
        ],
      },
      {
        id: "technical",
        title: { es: "Controles técnicos", en: "Technical controls" },
        description: { es: "Controles de seguridad móvil implementados.", en: "Mobile security controls in place." },
        fields: [
          { name: "mobileCategory", label: { es: "Categoría OWASP Mobile Top 10", en: "OWASP Mobile Top 10 category" }, type: "select", options: OWASP_MOBILE_TOP10_2024.map((c) => ({ value: c.id, label: { es: `${c.id}: ${c.nameEs}`, en: `${c.id}: ${c.name}` } })), required: true },
          { name: "insecureStorage", label: { es: "¿Almacena datos sensibles en el dispositivo?", en: "Does it store sensitive data on the device?" }, type: "select", options: [{ value: "si", label: { es: "Sí", en: "Yes" } }, { value: "no", label: { es: "No", en: "No" } }], required: true },
          { name: "localEncryption", label: { es: "¿Usa cifrado local?", en: "Does it use local encryption?" }, type: "select", options: [{ value: "si", label: { es: "Sí", en: "Yes" } }, { value: "no", label: { es: "No", en: "No" } }], required: true },
          { name: "thirdPartySdks", label: { es: "¿Usa SDKs de terceros?", en: "Does it use third-party SDKs?" }, type: "select", options: [{ value: "si", label: { es: "Sí", en: "Yes" } }, { value: "no", label: { es: "No", en: "No" } }], required: true },
          { name: "jailbreakDetection", label: { es: "¿Detección de jailbreak/root?", en: "Jailbreak/root detection?" }, type: "select", options: [{ value: "si", label: { es: "Sí", en: "Yes" } }, { value: "no", label: { es: "No", en: "No" } }], required: true },
          { name: "updateFrequency", label: { es: "Frecuencia de actualización (días)", en: "Update frequency (days)" }, type: "number", placeholder: "30", required: true },
          { name: "publishDays", label: { es: "Tiempo de aprobación en store (días)", en: "Store approval time (days)" }, type: "number", placeholder: "7", required: true },
        ],
      },
      {
        id: "economic",
        title: { es: "Impacto económico", en: "Financial impact" },
        description: { es: "Costos, moneda y confirmación final.", en: "Costs, currency, and final confirmation." },
        fields: [
          { name: "devCount", label: { es: "Desarrolladores móviles", en: "Mobile developers" }, type: "number", placeholder: "5", required: true },
          { name: "hourlyRate", label: { es: "Costo por hora del equipo", en: "Team hourly cost" }, type: "number", placeholder: "75", required: true },
          { name: "annualRevenue", label: { es: "Ingreso anual aproximado (USD)", en: "Approximate annual revenue (USD)" }, type: "number", placeholder: "2000000", required: true },
          CURRENCY_FIELD,
          CONFIRM_FIELD,
        ],
      },
    ],
  },
  {
    id: "sector",
    slug: "riesgo-por-sector",
    category: "seguridad",
    title: { es: "Costo de vulnerabilidad por sector", en: "Cost of vulnerability by sector" },
    shortDescription: { es: "Calcula el impacto financiero considerando sector, regulación, datos sensibles y madurez de seguridad.", en: "Calculates financial impact considering sector, regulation, sensitive data, and security maturity." },
    complexity: "media",
    estimatedTime: { es: "2 a 3 minutos", en: "2 to 3 minutes" },
    steps: [
      {
        id: "context",
        title: { es: "Su contexto", en: "Your context" },
        description: { es: "Sector y contexto regulatorio.", en: "Sector and regulatory context." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country" }, type: "select", options: COUNTRIES, required: true },
          { name: "regulation", label: { es: "Regulación aplicable", en: "Applicable regulation" }, type: "select", options: REGULATIONS, required: true },
        ],
      },
      {
        id: "application",
        title: { es: "Su aplicación", en: "Your application" },
        description: { es: "Criticidad y exposición del sistema.", en: "System criticality and exposure." },
        fields: [
          { name: "appCriticality", label: { es: "Criticidad de la aplicación", en: "Application criticality" }, type: "select", options: DEPENDENCY_LEVELS, required: true },
          { name: "digitalDependency", label: { es: "Dependencia digital del negocio", en: "Business digital dependency" }, type: "select", options: DEPENDENCY_LEVELS, required: true },
          { name: "exposure", label: { es: "Nivel de exposición pública", en: "Public exposure level" }, type: "select", options: EXPOSURE_LEVELS, required: true },
          { name: "dataTypes", label: { es: "Tipos de datos", en: "Data types" }, type: "multiselect", options: DATA_TYPES, required: true },
          { name: "recordVolume", label: { es: "Volumen de registros", en: "Record volume" }, type: "number", placeholder: "100000", required: true },
        ],
      },
      {
        id: "security",
        title: { es: "Madurez de seguridad", en: "Security maturity" },
        description: { es: "Controles y capacidades de seguridad actuales.", en: "Current security controls and capabilities." },
        fields: [
          { name: "securityMaturity", label: { es: "Nivel de madurez de seguridad", en: "Security maturity level" }, type: "select", options: MATURITY_LEVELS, required: true },
          { name: "controls", label: { es: "Controles existentes", en: "Existing controls" }, type: "multiselect", options: SECURITY_CONTROLS, required: true },
        ],
      },
      {
        id: "economic",
        title: { es: "Impacto económico", en: "Financial impact" },
        description: { es: "Datos financieros y confirmación final.", en: "Financial data and final confirmation." },
        fields: [
          { name: "monthlyRevenue", label: { es: "Ingreso mensual", en: "Monthly revenue" }, type: "number", placeholder: "500000", required: true },
          CURRENCY_FIELD,
          CONFIRM_FIELD,
        ],
      },
    ],
  },
  {
    id: "aspm-cost",
    slug: "costo-de-no-usar-aspm",
    category: "ahorros",
    title: { es: "Costo de no tener un ASPM", en: "Cost of not having an ASPM" },
    shortDescription: { es: "Mide cuánto tiempo y dinero pierde su equipo triando alertas duplicadas y sin priorizar entre herramientas de seguridad desconectadas.", en: "Measures how much time and money your team loses triaging duplicate, unprioritized alerts across disconnected security tools." },
    complexity: "baja",
    estimatedTime: { es: "2 minutos", en: "2 minutes" },
    steps: [
      {
        id: "context",
        title: { es: "Su panorama de seguridad", en: "Your security landscape" },
        description: { es: "Un vistazo rápido a su superficie de aplicaciones.", en: "A quick look at your application surface." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country" }, type: "select", options: COUNTRIES, required: true },
          { name: "appCount", label: { es: "Número de aplicaciones o repositorios activos", en: "Number of active applications or repositories" }, type: "number", placeholder: "20", required: true },
        ],
      },
      {
        id: "tools",
        title: { es: "Sus herramientas y hallazgos", en: "Your tools and findings" },
        description: { es: "Cuántas fuentes de alertas maneja hoy su equipo.", en: "How many alert sources your team manages today." },
        fields: [
          { name: "securityTools", label: { es: "Herramientas de escaneo en uso", en: "Scanning tools in use" }, type: "multiselect", options: SECURITY_TOOL_TYPES, tooltip: { es: "Cada herramienta desconectada suma tiempo de cambio de contexto.", en: "Every disconnected tool adds context-switching time." }, required: true },
          { name: "monthlyFindings", label: { es: "Hallazgos o alertas nuevas por mes (aprox.)", en: "New findings or alerts per month (approx.)" }, type: "number", placeholder: "500", required: true },
          { name: "noiseLevel", label: { es: "¿Qué porcentaje de esos hallazgos cree que son ruido (duplicados o falsos positivos)?", en: "What percentage of those findings do you think are noise (duplicates or false positives)?" }, type: "select", options: NOISE_LEVELS, required: true },
        ],
      },
      {
        id: "team",
        title: { es: "Su equipo y costos", en: "Your team and costs" },
        description: { es: "Último paso: esfuerzo dedicado a triar manualmente.", en: "Last step: effort spent on manual triage." },
        fields: [
          { name: "triageHoursWeek", label: { es: "Horas semanales dedicadas a triar y correlacionar hallazgos manualmente", en: "Weekly hours spent manually triaging and correlating findings" }, type: "number", placeholder: "10", required: true },
          { name: "teamSize", label: { es: "Personas involucradas en ese triage", en: "People involved in that triage" }, type: "number", placeholder: "2", required: true },
          { name: "hourlyRate", label: { es: "Costo promedio por hora de esas personas", en: "Average hourly cost of those people" }, type: "number", placeholder: "60", required: true },
          { name: "remediationDelayDays", label: { es: "Días extra que tarda en resolverse una vulnerabilidad crítica por falta de priorización clara", en: "Extra days it takes to resolve a critical vulnerability due to lack of clear prioritization" }, type: "number", placeholder: "21", required: true },
          CURRENCY_FIELD,
          CONFIRM_FIELD,
        ],
      },
    ],
  },
  {
    id: "cra-compliance",
    slug: "compliance-eu-cra",
    category: "compliance",
    title: { es: "Compliance con el EU Cyber Resilience Act", en: "Compliance with the EU Cyber Resilience Act" },
    shortDescription: { es: "Evalúe qué tan preparado está su producto de software frente a los requisitos esenciales, gestión de vulnerabilidades y obligaciones de reporte del Cyber Resilience Act (CRA) de la UE.", en: "Assess how prepared your software product is against the essential requirements, vulnerability management, and reporting obligations of the EU Cyber Resilience Act (CRA)." },
    complexity: "alta",
    estimatedTime: { es: "3 a 4 minutos", en: "3 to 4 minutes" },
    steps: [
      {
        id: "context",
        title: { es: "Su producto", en: "Your product" },
        description: { es: "Contexto regulatorio mínimo para calibrar la exposición.", en: "Minimal regulatory context to calibrate exposure." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country" }, type: "select", options: COUNTRIES, required: true },
          { name: "productCategory", label: { es: "Categoría de su producto según el CRA", en: "Your product's category under the CRA" }, type: "select", options: PRODUCT_CATEGORIES, tooltip: { es: "Los productos importantes y críticos (Anexo III/IV) requieren evaluación de conformidad por terceros.", en: "Important and critical products (Annex III/IV) require third-party conformity assessment." }, required: true },
          { name: "annualRevenue", label: { es: "Ingreso anual aproximado (USD)", en: "Approximate annual revenue (USD)" }, type: "number", placeholder: "5000000", required: true },
        ],
      },
      {
        id: "essential",
        title: { es: "Requisitos esenciales de ciberseguridad", en: "Essential cybersecurity requirements" },
        description: { es: "Anexo I, Parte I del CRA: seguridad por diseño y por defecto.", en: "Annex I, Part I of the CRA: security by design and by default." },
        fields: [
          { name: "secureByDesign", label: { es: "¿Su producto se diseña y desarrolla siguiendo principios de seguridad por diseño y por defecto?", en: "Is your product designed and developed following security-by-design and security-by-default principles?" }, type: "select", options: YES_NO_PARCIAL, required: true },
          { name: "noKnownVulnerabilities", label: { es: "¿Se libera sin vulnerabilidades explotables conocidas?", en: "Is it released without known exploitable vulnerabilities?" }, type: "select", options: YES_NO_PARCIAL, required: true },
          { name: "riskAssessment", label: { es: "¿Realiza una evaluación de riesgos de ciberseguridad documentada durante todo el ciclo de vida?", en: "Do you perform a documented cybersecurity risk assessment throughout the entire lifecycle?" }, type: "select", options: YES_NO_PARCIAL, required: true },
          { name: "dataProtection", label: { es: "¿Protege la confidencialidad e integridad de los datos que procesa?", en: "Does it protect the confidentiality and integrity of the data it processes?" }, type: "select", options: YES_NO_PARCIAL, required: true },
        ],
      },
      {
        id: "vulnManagement",
        title: { es: "Gestión de vulnerabilidades", en: "Vulnerability management" },
        description: { es: "Anexo I, Parte II del CRA: manejo del ciclo de vida de vulnerabilidades.", en: "Annex I, Part II of the CRA: vulnerability lifecycle handling." },
        fields: [
          { name: "hasSbom", label: { es: "¿Genera y mantiene un SBOM (inventario de componentes de software)?", en: "Do you generate and maintain an SBOM (software bill of materials)?" }, type: "select", options: YES_NO, required: true },
          { name: "hasDisclosurePolicy", label: { es: "¿Tiene una política de divulgación coordinada de vulnerabilidades?", en: "Do you have a coordinated vulnerability disclosure policy?" }, type: "select", options: YES_NO, required: true },
          { name: "patchDays", label: { es: "Tiempo promedio para publicar un parche tras detectar una vulnerabilidad (días)", en: "Average time to release a patch after detecting a vulnerability (days)" }, type: "number", placeholder: "30", required: true },
          { name: "supportYears", label: { es: "Años de soporte de seguridad comprometidos para el producto", en: "Years of committed security support for the product" }, type: "number", placeholder: "5", required: true },
        ],
      },
      {
        id: "reporting",
        title: { es: "Reporte de incidentes y conformidad", en: "Incident reporting and conformity" },
        description: { es: "Último paso: obligaciones de reporte y evaluación de conformidad.", en: "Last step: reporting obligations and conformity assessment." },
        fields: [
          { name: "hasIncidentProcess", label: { es: "¿Tiene un proceso para reportar una vulnerabilidad activamente explotada en menos de 24 horas a ENISA/CSIRT?", en: "Do you have a process to report an actively exploited vulnerability to ENISA/CSIRT within 24 hours?" }, type: "select", options: YES_NO_PARCIAL, required: true },
          { name: "conformityDone", label: { es: "¿Completó su evaluación de conformidad y expediente técnico?", en: "Have you completed your conformity assessment and technical documentation?" }, type: "select", options: CONFORMITY_STATUS, required: true },
          { name: "hourlyRate", label: { es: "Costo promedio por hora de su equipo de seguridad/ingeniería", en: "Average hourly cost of your security/engineering team" }, type: "number", placeholder: "85", required: true },
          CURRENCY_FIELD,
          CONFIRM_FIELD,
        ],
      },
    ],
  },
];

export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
  return CALCULATOR_CONFIGS.find((c) => c.slug === slug);
}

export function getCalculatorById(id: string): CalculatorConfig | undefined {
  return CALCULATOR_CONFIGS.find((c) => c.id === id);
}
