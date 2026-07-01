import { OWASP_TOP10_2021 } from "@/data/owaspTop10";
import { OWASP_MOBILE_TOP10_2024 } from "@/data/owaspMobileTop10";
import { ISO_25010_DIMENSIONS } from "@/data/isoQualityModel";
import { SECTOR_OPTIONS } from "@/data/sectorRiskFactors";
import {
  APP_TYPES,
  COMPANY_SIZES,
  COUNTRIES,
  DATA_TYPES,
  DEPENDENCY_LEVELS,
  EXPLOITATION_LEVELS,
  EXPOSURE_LEVELS,
  LOC_OPTIONS,
  MATURITY_LEVELS,
  OPERATIONAL_IMPACT,
  REGULATIONS,
  RELEASE_FREQUENCIES,
  SECURITY_CONTROLS,
} from "@/data/commonOptions";
import type { CalculatorConfig } from "@/types/calculator";

const companyContextFields = [
  { name: "sector", label: "Sector", type: "select" as const, options: SECTOR_OPTIONS, required: true },
  { name: "country", label: "País", type: "select" as const, options: COUNTRIES, required: true },
  { name: "companySize", label: "Tamaño de empresa", type: "select" as const, options: COMPANY_SIZES, required: true },
  { name: "employeeCount", label: "Número de empleados", type: "number" as const, placeholder: "250", required: true },
  { name: "annualRevenue", label: "Ingreso anual aproximado (USD)", type: "number" as const, placeholder: "5000000", tooltip: "Ingreso anual bruto aproximado de la organización.", required: true },
  { name: "softwareDependency", label: "Nivel de dependencia del software", type: "select" as const, options: DEPENDENCY_LEVELS, tooltip: "Qué tan crítico es el software para las operaciones del negocio.", required: true },
];

export const CALCULATOR_CONFIGS: CalculatorConfig[] = [
  {
    id: "iso-quality",
    slug: "no-calidad-codigo",
    title: "Costo de no calidad en el código",
    shortDescription: "Estima el costo anual de defectos, deuda técnica y baja mantenibilidad basado en ISO/IEC 25010.",
    complexity: "alta",
    estimatedTime: "3 a 5 minutos",
    steps: [
      {
        id: "company",
        title: "Contexto de la empresa",
        description: "Información organizacional para contextualizar el impacto económico.",
        fields: companyContextFields,
      },
      {
        id: "application",
        title: "Contexto de la aplicación",
        description: "Características técnicas y operativas de su portafolio de software.",
        fields: [
          { name: "appCount", label: "Número de aplicaciones", type: "number", placeholder: "5", required: true },
          { name: "appType", label: "Tipo de aplicación principal", type: "select", options: APP_TYPES, required: true },
          { name: "mainLanguages", label: "Lenguajes principales", type: "text", placeholder: "Java, Python, TypeScript", required: true },
          { name: "codeAge", label: "Antigüedad promedio del código (años)", type: "number", placeholder: "3", required: true },
          { name: "linesOfCode", label: "Líneas de código aproximadas", type: "select", options: LOC_OPTIONS, required: true },
          { name: "releaseFrequency", label: "Frecuencia de releases", type: "select", options: RELEASE_FREQUENCIES, required: true },
        ],
      },
      {
        id: "team",
        title: "Datos del equipo",
        description: "Recursos humanos dedicados al desarrollo y mantenimiento.",
        fields: [
          { name: "devCount", label: "Número de desarrolladores", type: "number", placeholder: "15", required: true },
          { name: "devMonthlyCost", label: "Costo promedio mensual por desarrollador", type: "number", placeholder: "5000", tooltip: "Salario + cargas + beneficios.", required: true },
          { name: "bugHours", label: "Horas semanales en corrección de bugs", type: "number", placeholder: "8", required: true },
          { name: "supportHours", label: "Horas semanales en soporte por defectos", type: "number", placeholder: "4", required: true },
          { name: "reworkHours", label: "Horas semanales en retrabajo", type: "number", placeholder: "6", required: true },
          { name: "monthlyIncidents", label: "Incidentes mensuales promedio", type: "number", placeholder: "3", required: true },
        ],
      },
      {
        id: "quality",
        title: "Dimensiones de calidad ISO/IEC 25010",
        description: "Evalúe cada dimensión de 1 (muy deficiente) a 5 (excelente). Referencia histórica ISO/IEC 9126 incluida.",
        fields: ISO_25010_DIMENSIONS.map((dim) => ({
          name: dim.id,
          label: `${dim.nameEs}${dim.iso9126Mapping ? ` (ISO 9126: ${dim.iso9126Mapping})` : ""}`,
          type: "slider" as const,
          min: 1,
          max: 5,
          defaultValue: 3,
          tooltip: dim.description,
          required: true,
        })),
      },
      {
        id: "impact",
        title: "Impacto económico",
        description: "Confirme la moneda y revise el contexto financiero.",
        fields: [
          { name: "currency", label: "Moneda de reporte", type: "select" as const, options: [
            { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "MXN", label: "MXN" },
            { value: "BRL", label: "BRL" }, { value: "COP", label: "COP" }, { value: "CLP", label: "CLP" }, { value: "PEN", label: "PEN" },
          ], required: true },
          { name: "confirmEstimate", label: "Entiendo que los resultados son estimaciones orientativas", type: "checkbox" as const, required: true },
        ],
      },
    ],
  },
  {
    id: "owasp-web",
    slug: "owasp-top10-web",
    title: "Costo de vulnerabilidad OWASP Top 10",
    shortDescription: "Estima el impacto económico de una vulnerabilidad OWASP Top 10 2021 en aplicaciones web.",
    complexity: "media",
    estimatedTime: "3 a 5 minutos",
    steps: [
      {
        id: "company",
        title: "Contexto de la empresa",
        description: "Contexto organizacional y sectorial.",
        fields: companyContextFields,
      },
      {
        id: "application",
        title: "Contexto de la aplicación",
        description: "Características de la aplicación web afectada.",
        fields: [
          { name: "appType", label: "Tipo de aplicación", type: "select", options: APP_TYPES, required: true },
          { name: "userCount", label: "Número de usuarios", type: "number", placeholder: "50000", required: true },
          { name: "sensitiveRecords", label: "Registros sensibles aproximados", type: "number", placeholder: "100000", required: true },
          { name: "dataTypes", label: "Tipos de datos procesados", type: "multiselect", options: DATA_TYPES, required: true },
          { name: "exposure", label: "Nivel de exposición", type: "select", options: EXPOSURE_LEVELS, required: true },
        ],
      },
      {
        id: "vulnerability",
        title: "Datos técnicos de la vulnerabilidad",
        description: "Detalles específicos de la vulnerabilidad OWASP identificada.",
        fields: [
          { name: "owaspCategory", label: "Categoría OWASP Top 10", type: "select", options: OWASP_TOP10_2021.map((c) => ({ value: c.id, label: `${c.id}: ${c.nameEs}` })), required: true },
          { name: "environment", label: "Ambiente afectado", type: "select", options: [
            { value: "desarrollo", label: "Desarrollo" }, { value: "testing", label: "Testing" }, { value: "produccion", label: "Producción" },
          ], required: true },
          { name: "exploitationLevel", label: "Nivel de explotación", type: "select", options: EXPLOITATION_LEVELS, required: true },
          { name: "exposureDays", label: "Tiempo estimado de exposición (días)", type: "number", placeholder: "30", required: true },
          { name: "remediationDays", label: "Tiempo estimado de remediación (días)", type: "number", placeholder: "14", required: true },
        ],
      },
      {
        id: "economic",
        title: "Impacto económico",
        description: "Costos operativos y de respuesta.",
        fields: [
          { name: "hourlyRate", label: "Costo promedio por hora del equipo técnico", type: "number", placeholder: "75", required: true },
          { name: "operationalImpact", label: "Impacto en operación", type: "select", options: OPERATIONAL_IMPACT, required: true },
          { name: "currency", label: "Moneda de reporte", type: "select", options: [
            { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "MXN", label: "MXN" },
            { value: "BRL", label: "BRL" }, { value: "COP", label: "COP" }, { value: "CLP", label: "CLP" }, { value: "PEN", label: "PEN" },
          ], required: true },
          { name: "confirmEstimate", label: "Entiendo que los resultados son estimaciones orientativas", type: "checkbox", required: true },
        ],
      },
      {
        id: "review",
        title: "Revisión final",
        description: "Confirme sus datos antes de calcular.",
        fields: [],
      },
    ],
  },
  {
    id: "owasp-mobile",
    slug: "owasp-mobile-top10",
    title: "Costo de vulnerabilidad OWASP Mobile Top 10",
    shortDescription: "Estima el impacto económico de vulnerabilidades en apps móviles según OWASP Mobile Top 10 2024.",
    complexity: "media",
    estimatedTime: "3 a 5 minutos",
    steps: [
      {
        id: "company",
        title: "Contexto de la empresa",
        description: "Información organizacional.",
        fields: companyContextFields,
      },
      {
        id: "application",
        title: "Contexto de la aplicación móvil",
        description: "Características de la app móvil.",
        fields: [
          { name: "platform", label: "Plataforma", type: "select", options: [
            { value: "ios", label: "iOS" }, { value: "android", label: "Android" }, { value: "ambas", label: "Ambas" },
          ], required: true },
          { name: "appType", label: "Tipo de aplicación", type: "select", options: [
            { value: "banca", label: "Banca" }, { value: "fintech", label: "Fintech" }, { value: "salud", label: "Salud" },
            { value: "retail", label: "Retail" }, { value: "ecommerce", label: "E-commerce" }, { value: "gobierno", label: "Gobierno" },
            { value: "educacion", label: "Educación" }, { value: "logistica", label: "Logística" }, { value: "saas", label: "SaaS" }, { value: "otra", label: "Otra" },
          ], required: true },
          { name: "activeUsers", label: "Usuarios activos", type: "number", placeholder: "50000", required: true },
          { name: "downloads", label: "Número de descargas", type: "number", placeholder: "200000", required: true },
          { name: "hasPayments", label: "¿Procesa pagos in-app?", type: "select", options: [
            { value: "si", label: "Sí" }, { value: "no", label: "No" },
          ], required: true },
        ],
      },
      {
        id: "technical",
        title: "Datos técnicos",
        description: "Controles de seguridad móvil implementados.",
        fields: [
          { name: "mobileCategory", label: "Categoría OWASP Mobile Top 10", type: "select", options: OWASP_MOBILE_TOP10_2024.map((c) => ({ value: c.id, label: `${c.id}: ${c.nameEs}` })), required: true },
          { name: "insecureStorage", label: "¿Almacena datos sensibles en el dispositivo?", type: "select", options: [{ value: "si", label: "Sí" }, { value: "no", label: "No" }], required: true },
          { name: "localEncryption", label: "¿Usa cifrado local?", type: "select", options: [{ value: "si", label: "Sí" }, { value: "no", label: "No" }], required: true },
          { name: "thirdPartySdks", label: "¿Usa SDKs de terceros?", type: "select", options: [{ value: "si", label: "Sí" }, { value: "no", label: "No" }], required: true },
          { name: "jailbreakDetection", label: "¿Detección de jailbreak/root?", type: "select", options: [{ value: "si", label: "Sí" }, { value: "no", label: "No" }], required: true },
          { name: "updateFrequency", label: "Frecuencia de actualización (días)", type: "number", placeholder: "30", required: true },
          { name: "publishDays", label: "Tiempo de aprobación en store (días)", type: "number", placeholder: "7", required: true },
        ],
      },
      {
        id: "economic",
        title: "Impacto económico",
        description: "Costos y moneda.",
        fields: [
          { name: "devCount", label: "Desarrolladores móviles", type: "number", placeholder: "5", required: true },
          { name: "hourlyRate", label: "Costo por hora del equipo", type: "number", placeholder: "75", required: true },
          { name: "currency", label: "Moneda", type: "select", options: [
            { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "MXN", label: "MXN" },
            { value: "BRL", label: "BRL" }, { value: "COP", label: "COP" }, { value: "CLP", label: "CLP" }, { value: "PEN", label: "PEN" },
          ], required: true },
          { name: "confirmEstimate", label: "Entiendo que los resultados son estimaciones orientativas", type: "checkbox", required: true },
        ],
      },
      {
        id: "review",
        title: "Revisión final",
        description: "Confirme antes de calcular.",
        fields: [],
      },
    ],
  },
  {
    id: "sector",
    slug: "riesgo-por-sector",
    title: "Costo de vulnerabilidad por sector",
    shortDescription: "Calcula el impacto financiero considerando sector, regulación, datos sensibles y madurez de seguridad.",
    complexity: "media",
    estimatedTime: "3 a 5 minutos",
    steps: [
      {
        id: "company",
        title: "Contexto de la empresa",
        description: "Sector y contexto regulatorio.",
        fields: [
          ...companyContextFields,
          { name: "regulation", label: "Regulación aplicable", type: "select", options: REGULATIONS, required: true },
        ],
      },
      {
        id: "application",
        title: "Contexto de la aplicación",
        description: "Criticidad y exposición del sistema.",
        fields: [
          { name: "appCriticality", label: "Criticidad de la aplicación", type: "select", options: DEPENDENCY_LEVELS, required: true },
          { name: "digitalDependency", label: "Dependencia digital del negocio", type: "select", options: DEPENDENCY_LEVELS, required: true },
          { name: "exposure", label: "Nivel de exposición pública", type: "select", options: EXPOSURE_LEVELS, required: true },
          { name: "dataTypes", label: "Tipos de datos", type: "multiselect", options: DATA_TYPES, required: true },
          { name: "recordVolume", label: "Volumen de registros", type: "number", placeholder: "100000", required: true },
        ],
      },
      {
        id: "security",
        title: "Madurez de seguridad",
        description: "Controles y capacidades de seguridad actuales.",
        fields: [
          { name: "securityMaturity", label: "Nivel de madurez de seguridad", type: "select", options: MATURITY_LEVELS, required: true },
          { name: "controls", label: "Controles existentes", type: "multiselect", options: SECURITY_CONTROLS, required: true },
        ],
      },
      {
        id: "economic",
        title: "Impacto económico",
        description: "Datos financieros.",
        fields: [
          { name: "monthlyRevenue", label: "Ingreso mensual", type: "number", placeholder: "500000", required: true },
          { name: "currency", label: "Moneda", type: "select", options: [
            { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "MXN", label: "MXN" },
            { value: "BRL", label: "BRL" }, { value: "COP", label: "COP" }, { value: "CLP", label: "CLP" }, { value: "PEN", label: "PEN" },
          ], required: true },
          { name: "confirmEstimate", label: "Entiendo que los resultados son estimaciones orientativas", type: "checkbox", required: true },
        ],
      },
      {
        id: "review",
        title: "Revisión final",
        description: "Confirme antes de calcular.",
        fields: [],
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