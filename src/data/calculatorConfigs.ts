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
import {
  DORA_ENTITY_TYPES,
  DORA_QUESTIONS,
  doraFieldFromQuestion,
} from "@/data/doraQuestions";
import type { CalculatorConfig } from "@/types/calculator";

const CURRENCY_FIELD = {
  name: "currency",
  label: { es: "Moneda de reporte", en: "Report currency", pt: "Moeda do relatório" },
  type: "select" as const,
  options: [
    { value: "USD", label: { es: "USD", en: "USD", pt: "USD" } }, { value: "EUR", label: { es: "EUR", en: "EUR", pt: "EUR" } }, { value: "MXN", label: { es: "MXN", en: "MXN", pt: "MXN" } },
    { value: "BRL", label: { es: "BRL", en: "BRL", pt: "BRL" } }, { value: "COP", label: { es: "COP", en: "COP", pt: "COP" } }, { value: "CLP", label: { es: "CLP", en: "CLP", pt: "CLP" } }, { value: "PEN", label: { es: "PEN", en: "PEN", pt: "PEN" } },
  ],
};

const CONFIRM_FIELD = {
  name: "confirmEstimate",
  label: { es: "Entiendo que los resultados son estimaciones orientativas", en: "I understand the results are indicative estimates", pt: "Entendo que os resultados são estimativas orientativas" },
  type: "checkbox" as const,
  required: true,
};

export const CALCULATOR_CONFIGS: CalculatorConfig[] = [
  {
    id: "iso-quality",
    slug: "no-calidad-codigo",
    category: "calidad",
    title: { es: "Costo de no calidad en el código", en: "Cost of poor code quality", pt: "Custo da não qualidade no código" },
    shortDescription: { es: "Estima el costo anual de defectos, deuda técnica y baja mantenibilidad basado en ISO/IEC 25010.", en: "Estimates the annual cost of defects, technical debt, and low maintainability based on ISO/IEC 25010.", pt: "Estima o custo anual de defeitos, dívida técnica e baixa manutenibilidade com base na ISO/IEC 25010." },
    complexity: "alta",
    estimatedTime: { es: "2 a 3 minutos", en: "2 to 3 minutes", pt: "2 a 3 minutos" },
    steps: [
      {
        id: "context",
        title: { es: "Su contexto", en: "Your context", pt: "Seu contexto" },
        description: { es: "Solo lo esencial para calibrar el resultado.", en: "Just the essentials to calibrate the result.", pt: "Apenas o essencial para calibrar o resultado." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector", pt: "Setor" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country", pt: "País" }, type: "select", options: COUNTRIES, required: true },
          { name: "softwareDependency", label: { es: "Dependencia del negocio del software", en: "Business dependency on software", pt: "Dependência do negócio em relação ao software" }, type: "select", options: DEPENDENCY_LEVELS, tooltip: { es: "Qué tan crítico es el software para las operaciones del negocio.", en: "How critical the software is to business operations.", pt: "Quão crítico o software é para as operações do negócio." }, required: true },
          { name: "appType", label: { es: "Tipo de aplicación principal", en: "Main application type", pt: "Tipo principal de aplicação" }, type: "select", options: APP_TYPES, required: true },
          { name: "codeAge", label: { es: "Antigüedad promedio del código (años)", en: "Average code age (years)", pt: "Idade média do código (anos)" }, type: "number", placeholder: "3", required: true },
          { name: "linesOfCode", label: { es: "Líneas de código aproximadas", en: "Approximate lines of code", pt: "Linhas de código aproximadas" }, type: "select", options: LOC_OPTIONS, required: true },
        ],
      },
      {
        id: "team",
        title: { es: "Su equipo", en: "Your team", pt: "Sua equipe" },
        description: { es: "Datos de esfuerzo dedicado a mantener el software.", en: "Data on effort dedicated to maintaining the software.", pt: "Dados sobre o esforço dedicado à manutenção do software." },
        fields: [
          { name: "devCount", label: { es: "Número de desarrolladores", en: "Number of developers", pt: "Número de desenvolvedores" }, type: "number", placeholder: "15", required: true },
          { name: "devMonthlyCost", label: { es: "Costo promedio mensual por desarrollador", en: "Average monthly cost per developer", pt: "Custo médio mensal por desenvolvedor" }, type: "number", placeholder: "5000", tooltip: { es: "Salario + cargas + beneficios.", en: "Salary + payroll charges + benefits.", pt: "Salário + encargos + benefícios." }, required: true },
          { name: "bugHours", label: { es: "Horas semanales en corrección de bugs", en: "Weekly hours spent fixing bugs", pt: "Horas semanais em correção de bugs" }, type: "number", placeholder: "8", required: true },
          { name: "supportHours", label: { es: "Horas semanales en soporte por defectos", en: "Weekly hours spent on defect-related support", pt: "Horas semanais em suporte por defeitos" }, type: "number", placeholder: "4", required: true },
          { name: "reworkHours", label: { es: "Horas semanales en retrabajo", en: "Weekly hours spent on rework", pt: "Horas semanais em retrabalho" }, type: "number", placeholder: "6", required: true },
          { name: "monthlyIncidents", label: { es: "Incidentes mensuales promedio", en: "Average monthly incidents", pt: "Incidentes mensais em média" }, type: "number", placeholder: "3", required: true },
        ],
      },
      {
        id: "quality",
        title: { es: "Calidad de su código (ISO/IEC 25010)", en: "Your code quality (ISO/IEC 25010)", pt: "Qualidade do seu código (ISO/IEC 25010)" },
        description: { es: "Deslice cada indicador de 1 (muy deficiente) a 5 (excelente). Ya vienen en un punto medio, ajuste solo lo que sepa.", en: "Slide each indicator from 1 (very poor) to 5 (excellent). They start at a midpoint — adjust only what you know.", pt: "Deslize cada indicador de 1 (muito deficiente) a 5 (excelente). Eles já começam em um ponto médio — ajuste apenas o que souber." },
        fields: ISO_25010_DIMENSIONS.map((dim) => ({
          name: dim.id,
          label: {
            es: `${dim.nameEs}${dim.iso9126Mapping ? ` (ISO 9126: ${dim.iso9126Mapping})` : ""}`,
            en: `${dim.name}${dim.iso9126Mapping ? ` (ISO 9126: ${dim.iso9126Mapping})` : ""}`,
            pt: `${dim.nameEs}${dim.iso9126Mapping ? ` (ISO 9126: ${dim.iso9126Mapping})` : ""}`,
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
        title: { es: "Confirmar y calcular", en: "Confirm and calculate", pt: "Confirmar e calcular" },
        description: { es: "Último paso: revise la moneda y confirme.", en: "Last step: review the currency and confirm.", pt: "Última etapa: revise a moeda e confirme." },
        fields: [CURRENCY_FIELD, CONFIRM_FIELD],
      },
    ],
  },
  {
    id: "owasp-web",
    slug: "owasp-top10-web",
    category: "seguridad",
    title: { es: "Costo de vulnerabilidad OWASP Top 10", en: "Cost of an OWASP Top 10 vulnerability", pt: "Custo de vulnerabilidade OWASP Top 10" },
    shortDescription: { es: "Estima el impacto económico de una vulnerabilidad OWASP Top 10 2021 en aplicaciones web.", en: "Estimates the financial impact of an OWASP Top 10 2021 vulnerability in web applications.", pt: "Estima o impacto financeiro de uma vulnerabilidade OWASP Top 10 2021 em aplicações web." },
    complexity: "media",
    estimatedTime: { es: "2 a 3 minutos", en: "2 to 3 minutes", pt: "2 a 3 minutos" },
    steps: [
      {
        id: "context",
        title: { es: "Su contexto", en: "Your context", pt: "Seu contexto" },
        description: { es: "Contexto organizacional mínimo.", en: "Minimal organizational context.", pt: "Contexto organizacional mínimo." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector", pt: "Setor" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country", pt: "País" }, type: "select", options: COUNTRIES, required: true },
          { name: "softwareDependency", label: { es: "Dependencia del negocio del software", en: "Business dependency on software", pt: "Dependência do negócio em relação ao software" }, type: "select", options: DEPENDENCY_LEVELS, required: true },
        ],
      },
      {
        id: "application",
        title: { es: "Su aplicación", en: "Your application", pt: "Sua aplicação" },
        description: { es: "Características de la aplicación web afectada.", en: "Characteristics of the affected web application.", pt: "Características da aplicação web afetada." },
        fields: [
          { name: "appType", label: { es: "Tipo de aplicación", en: "Application type", pt: "Tipo de aplicação" }, type: "select", options: APP_TYPES, required: true },
          { name: "userCount", label: { es: "Número de usuarios", en: "Number of users", pt: "Número de usuários" }, type: "number", placeholder: "50000", required: true },
          { name: "sensitiveRecords", label: { es: "Registros sensibles aproximados", en: "Approximate sensitive records", pt: "Registros sensíveis aproximados" }, type: "number", placeholder: "100000", required: true },
          { name: "dataTypes", label: { es: "Tipos de datos procesados", en: "Types of data processed", pt: "Tipos de dados processados" }, type: "multiselect", options: DATA_TYPES, required: true },
          { name: "exposure", label: { es: "Nivel de exposición", en: "Exposure level", pt: "Nível de exposição" }, type: "select", options: EXPOSURE_LEVELS, required: true },
        ],
      },
      {
        id: "vulnerability",
        title: { es: "La vulnerabilidad", en: "The vulnerability", pt: "A vulnerabilidade" },
        description: { es: "Detalles específicos de la vulnerabilidad OWASP identificada.", en: "Specific details of the identified OWASP vulnerability.", pt: "Detalhes específicos da vulnerabilidade OWASP identificada." },
        fields: [
          { name: "owaspCategory", label: { es: "Categoría OWASP Top 10", en: "OWASP Top 10 category", pt: "Categoria OWASP Top 10" }, type: "select", options: OWASP_TOP10_2021.map((c) => ({ value: c.id, label: { es: `${c.id}: ${c.nameEs}`, en: `${c.id}: ${c.name}`, pt: `${c.id}: ${c.nameEs}` } })), required: true },
          { name: "environment", label: { es: "Ambiente afectado", en: "Affected environment", pt: "Ambiente afetado" }, type: "select", options: [
            { value: "desarrollo", label: { es: "Desarrollo", en: "Development", pt: "Desenvolvimento" } }, { value: "testing", label: { es: "Testing", en: "Testing", pt: "Testes" } }, { value: "produccion", label: { es: "Producción", en: "Production", pt: "Produção" } },
          ], required: true },
          { name: "exploitationLevel", label: { es: "Nivel de explotación", en: "Exploitation level", pt: "Nível de exploração" }, type: "select", options: EXPLOITATION_LEVELS, required: true },
          { name: "exposureDays", label: { es: "Tiempo estimado de exposición (días)", en: "Estimated exposure time (days)", pt: "Tempo estimado de exposição (dias)" }, type: "number", placeholder: "30", required: true },
          { name: "remediationDays", label: { es: "Tiempo estimado de remediación (días)", en: "Estimated remediation time (days)", pt: "Tempo estimado de remediação (dias)" }, type: "number", placeholder: "14", required: true },
        ],
      },
      {
        id: "economic",
        title: { es: "Impacto económico", en: "Financial impact", pt: "Impacto financeiro" },
        description: { es: "Costos operativos y confirmación final.", en: "Operational costs and final confirmation.", pt: "Custos operacionais e confirmação final." },
        fields: [
          { name: "hourlyRate", label: { es: "Costo promedio por hora del equipo técnico", en: "Average hourly cost of the technical team", pt: "Custo médio por hora da equipe técnica" }, type: "number", placeholder: "75", required: true },
          { name: "annualRevenue", label: { es: "Ingreso anual aproximado (USD)", en: "Approximate annual revenue (USD)", pt: "Receita anual aproximada (USD)" }, type: "number", placeholder: "5000000", required: true },
          { name: "operationalImpact", label: { es: "Impacto en operación", en: "Operational impact", pt: "Impacto na operação" }, type: "select", options: OPERATIONAL_IMPACT, required: true },
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
    title: { es: "Costo de vulnerabilidad OWASP Mobile Top 10", en: "Cost of an OWASP Mobile Top 10 vulnerability", pt: "Custo de vulnerabilidade OWASP Mobile Top 10" },
    shortDescription: { es: "Estima el impacto económico de vulnerabilidades en apps móviles según OWASP Mobile Top 10 2024.", en: "Estimates the financial impact of mobile app vulnerabilities according to the OWASP Mobile Top 10 2024.", pt: "Estima o impacto financeiro de vulnerabilidades em apps móveis conforme o OWASP Mobile Top 10 2024." },
    complexity: "media",
    estimatedTime: { es: "2 a 3 minutos", en: "2 to 3 minutes", pt: "2 a 3 minutos" },
    steps: [
      {
        id: "context",
        title: { es: "Su contexto", en: "Your context", pt: "Seu contexto" },
        description: { es: "Contexto organizacional mínimo.", en: "Minimal organizational context.", pt: "Contexto organizacional mínimo." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector", pt: "Setor" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country", pt: "País" }, type: "select", options: COUNTRIES, required: true },
        ],
      },
      {
        id: "application",
        title: { es: "Su app móvil", en: "Your mobile app", pt: "Seu app móvel" },
        description: { es: "Características de la app móvil.", en: "Characteristics of the mobile app.", pt: "Características do app móvel." },
        fields: [
          { name: "platform", label: { es: "Plataforma", en: "Platform", pt: "Plataforma" }, type: "select", options: [
            { value: "ios", label: { es: "iOS", en: "iOS", pt: "iOS" } }, { value: "android", label: { es: "Android", en: "Android", pt: "Android" } }, { value: "ambas", label: { es: "Ambas", en: "Both", pt: "Ambas" } },
          ], required: true },
          { name: "appType", label: { es: "Tipo de aplicación", en: "Application type", pt: "Tipo de aplicação" }, type: "select", options: [
            { value: "banca", label: { es: "Banca", en: "Banking", pt: "Bancos" } }, { value: "fintech", label: { es: "Fintech", en: "Fintech", pt: "Fintech" } }, { value: "salud", label: { es: "Salud", en: "Healthcare", pt: "Saúde" } },
            { value: "retail", label: { es: "Retail", en: "Retail", pt: "Varejo" } }, { value: "ecommerce", label: { es: "E-commerce", en: "E-commerce", pt: "E-commerce" } }, { value: "gobierno", label: { es: "Gobierno", en: "Government", pt: "Governo" } },
            { value: "educacion", label: { es: "Educación", en: "Education", pt: "Educação" } }, { value: "logistica", label: { es: "Logística", en: "Logistics", pt: "Logística" } }, { value: "saas", label: { es: "SaaS", en: "SaaS", pt: "SaaS" } }, { value: "otra", label: { es: "Otra", en: "Other", pt: "Outra" } },
          ], required: true },
          { name: "activeUsers", label: { es: "Usuarios activos", en: "Active users", pt: "Usuários ativos" }, type: "number", placeholder: "50000", required: true },
          { name: "downloads", label: { es: "Número de descargas", en: "Number of downloads", pt: "Número de downloads" }, type: "number", placeholder: "200000", required: true },
          { name: "hasPayments", label: { es: "¿Procesa pagos in-app?", en: "Does it process in-app payments?", pt: "Processa pagamentos in-app?" }, type: "select", options: [
            { value: "si", label: { es: "Sí", en: "Yes", pt: "Sim" } }, { value: "no", label: { es: "No", en: "No", pt: "Não" } },
          ], required: true },
        ],
      },
      {
        id: "technical",
        title: { es: "Controles técnicos", en: "Technical controls", pt: "Controles técnicos" },
        description: { es: "Controles de seguridad móvil implementados.", en: "Mobile security controls in place.", pt: "Controles de segurança móvel implementados." },
        fields: [
          { name: "mobileCategory", label: { es: "Categoría OWASP Mobile Top 10", en: "OWASP Mobile Top 10 category", pt: "Categoria OWASP Mobile Top 10" }, type: "select", options: OWASP_MOBILE_TOP10_2024.map((c) => ({ value: c.id, label: { es: `${c.id}: ${c.nameEs}`, en: `${c.id}: ${c.name}`, pt: `${c.id}: ${c.nameEs}` } })), required: true },
          { name: "insecureStorage", label: { es: "¿Almacena datos sensibles en el dispositivo?", en: "Does it store sensitive data on the device?", pt: "Armazena dados sensíveis no dispositivo?" }, type: "select", options: [{ value: "si", label: { es: "Sí", en: "Yes", pt: "Sim" } }, { value: "no", label: { es: "No", en: "No", pt: "Não" } }], required: true },
          { name: "localEncryption", label: { es: "¿Usa cifrado local?", en: "Does it use local encryption?", pt: "Usa criptografia local?" }, type: "select", options: [{ value: "si", label: { es: "Sí", en: "Yes", pt: "Sim" } }, { value: "no", label: { es: "No", en: "No", pt: "Não" } }], required: true },
          { name: "thirdPartySdks", label: { es: "¿Usa SDKs de terceros?", en: "Does it use third-party SDKs?", pt: "Usa SDKs de terceiros?" }, type: "select", options: [{ value: "si", label: { es: "Sí", en: "Yes", pt: "Sim" } }, { value: "no", label: { es: "No", en: "No", pt: "Não" } }], required: true },
          { name: "jailbreakDetection", label: { es: "¿Detección de jailbreak/root?", en: "Jailbreak/root detection?", pt: "Detecção de jailbreak/root?" }, type: "select", options: [{ value: "si", label: { es: "Sí", en: "Yes", pt: "Sim" } }, { value: "no", label: { es: "No", en: "No", pt: "Não" } }], required: true },
          { name: "updateFrequency", label: { es: "Frecuencia de actualización (días)", en: "Update frequency (days)", pt: "Frequência de atualização (dias)" }, type: "number", placeholder: "30", required: true },
          { name: "publishDays", label: { es: "Tiempo de aprobación en store (días)", en: "Store approval time (days)", pt: "Tempo de aprovação na loja (dias)" }, type: "number", placeholder: "7", required: true },
        ],
      },
      {
        id: "economic",
        title: { es: "Impacto económico", en: "Financial impact", pt: "Impacto financeiro" },
        description: { es: "Costos, moneda y confirmación final.", en: "Costs, currency, and final confirmation.", pt: "Custos, moeda e confirmação final." },
        fields: [
          { name: "devCount", label: { es: "Desarrolladores móviles", en: "Mobile developers", pt: "Desenvolvedores móveis" }, type: "number", placeholder: "5", required: true },
          { name: "hourlyRate", label: { es: "Costo por hora del equipo", en: "Team hourly cost", pt: "Custo por hora da equipe" }, type: "number", placeholder: "75", required: true },
          { name: "annualRevenue", label: { es: "Ingreso anual aproximado (USD)", en: "Approximate annual revenue (USD)", pt: "Receita anual aproximada (USD)" }, type: "number", placeholder: "2000000", required: true },
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
    title: { es: "Costo de vulnerabilidad por sector", en: "Cost of vulnerability by sector", pt: "Custo de vulnerabilidade por setor" },
    shortDescription: { es: "Calcula el impacto financiero considerando sector, regulación, datos sensibles y madurez de seguridad.", en: "Calculates financial impact considering sector, regulation, sensitive data, and security maturity.", pt: "Calcula o impacto financeiro considerando setor, regulamentação, dados sensíveis e maturidade de segurança." },
    complexity: "media",
    estimatedTime: { es: "2 a 3 minutos", en: "2 to 3 minutes", pt: "2 a 3 minutos" },
    steps: [
      {
        id: "context",
        title: { es: "Su contexto", en: "Your context", pt: "Seu contexto" },
        description: { es: "Sector y contexto regulatorio.", en: "Sector and regulatory context.", pt: "Setor e contexto regulatório." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector", pt: "Setor" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country", pt: "País" }, type: "select", options: COUNTRIES, required: true },
          { name: "regulation", label: { es: "Regulación aplicable", en: "Applicable regulation", pt: "Regulamentação aplicável" }, type: "select", options: REGULATIONS, required: true },
        ],
      },
      {
        id: "application",
        title: { es: "Su aplicación", en: "Your application", pt: "Sua aplicação" },
        description: { es: "Criticidad y exposición del sistema.", en: "System criticality and exposure.", pt: "Criticidade e exposição do sistema." },
        fields: [
          { name: "appCriticality", label: { es: "Criticidad de la aplicación", en: "Application criticality", pt: "Criticidade da aplicação" }, type: "select", options: DEPENDENCY_LEVELS, required: true },
          { name: "digitalDependency", label: { es: "Dependencia digital del negocio", en: "Business digital dependency", pt: "Dependência digital do negócio" }, type: "select", options: DEPENDENCY_LEVELS, required: true },
          { name: "exposure", label: { es: "Nivel de exposición pública", en: "Public exposure level", pt: "Nível de exposição pública" }, type: "select", options: EXPOSURE_LEVELS, required: true },
          { name: "dataTypes", label: { es: "Tipos de datos", en: "Data types", pt: "Tipos de dados" }, type: "multiselect", options: DATA_TYPES, required: true },
          { name: "recordVolume", label: { es: "Volumen de registros", en: "Record volume", pt: "Volume de registros" }, type: "number", placeholder: "100000", required: true },
        ],
      },
      {
        id: "security",
        title: { es: "Madurez de seguridad", en: "Security maturity", pt: "Maturidade de segurança" },
        description: { es: "Controles y capacidades de seguridad actuales.", en: "Current security controls and capabilities.", pt: "Controles e capacidades de segurança atuais." },
        fields: [
          { name: "securityMaturity", label: { es: "Nivel de madurez de seguridad", en: "Security maturity level", pt: "Nível de maturidade de segurança" }, type: "select", options: MATURITY_LEVELS, required: true },
          { name: "controls", label: { es: "Controles existentes", en: "Existing controls", pt: "Controles existentes" }, type: "multiselect", options: SECURITY_CONTROLS, required: true },
        ],
      },
      {
        id: "economic",
        title: { es: "Impacto económico", en: "Financial impact", pt: "Impacto financeiro" },
        description: { es: "Datos financieros y confirmación final.", en: "Financial data and final confirmation.", pt: "Dados financeiros e confirmação final." },
        fields: [
          { name: "monthlyRevenue", label: { es: "Ingreso mensual", en: "Monthly revenue", pt: "Receita mensal" }, type: "number", placeholder: "500000", required: true },
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
    title: { es: "Costo de no tener un ASPM", en: "Cost of not having an ASPM", pt: "Custo de não ter um ASPM" },
    shortDescription: { es: "Mide cuánto tiempo y dinero pierde su equipo triando alertas duplicadas y sin priorizar entre herramientas de seguridad desconectadas.", en: "Measures how much time and money your team loses triaging duplicate, unprioritized alerts across disconnected security tools.", pt: "Mede quanto tempo e dinheiro sua equipe perde triando alertas duplicadas e sem priorização entre ferramentas de segurança desconectadas." },
    complexity: "baja",
    estimatedTime: { es: "2 minutos", en: "2 minutes", pt: "2 minutos" },
    steps: [
      {
        id: "context",
        title: { es: "Su panorama de seguridad", en: "Your security landscape", pt: "Seu panorama de segurança" },
        description: { es: "Un vistazo rápido a su superficie de aplicaciones.", en: "A quick look at your application surface.", pt: "Uma visão rápida da sua superfície de aplicações." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector", pt: "Setor" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country", pt: "País" }, type: "select", options: COUNTRIES, required: true },
          { name: "appCount", label: { es: "Número de aplicaciones o repositorios activos", en: "Number of active applications or repositories", pt: "Número de aplicações ou repositórios ativos" }, type: "number", placeholder: "20", required: true },
        ],
      },
      {
        id: "tools",
        title: { es: "Sus herramientas y hallazgos", en: "Your tools and findings", pt: "Suas ferramentas e achados" },
        description: { es: "Cuántas fuentes de alertas maneja hoy su equipo.", en: "How many alert sources your team manages today.", pt: "Quantas fontes de alertas sua equipe gerencia hoje." },
        fields: [
          { name: "securityTools", label: { es: "Herramientas de escaneo en uso", en: "Scanning tools in use", pt: "Ferramentas de varredura em uso" }, type: "multiselect", options: SECURITY_TOOL_TYPES, tooltip: { es: "Cada herramienta desconectada suma tiempo de cambio de contexto.", en: "Every disconnected tool adds context-switching time.", pt: "Cada ferramenta desconectada adiciona tempo de troca de contexto." }, required: true },
          { name: "monthlyFindings", label: { es: "Hallazgos o alertas nuevas por mes (aprox.)", en: "New findings or alerts per month (approx.)", pt: "Achados ou alertas novos por mês (aprox.)" }, type: "number", placeholder: "500", required: true },
          { name: "noiseLevel", label: { es: "¿Qué porcentaje de esos hallazgos cree que son ruido (duplicados o falsos positivos)?", en: "What percentage of those findings do you think are noise (duplicates or false positives)?", pt: "Qual porcentagem desses achados você considera ruído (duplicatas ou falsos positivos)?" }, type: "select", options: NOISE_LEVELS, required: true },
        ],
      },
      {
        id: "team",
        title: { es: "Su equipo y costos", en: "Your team and costs", pt: "Sua equipe e custos" },
        description: { es: "Último paso: esfuerzo dedicado a triar manualmente.", en: "Last step: effort spent on manual triage.", pt: "Última etapa: esforço dedicado à triagem manual." },
        fields: [
          { name: "triageHoursWeek", label: { es: "Horas semanales dedicadas a triar y correlacionar hallazgos manualmente", en: "Weekly hours spent manually triaging and correlating findings", pt: "Horas semanais dedicadas a triar e correlacionar achados manualmente" }, type: "number", placeholder: "10", required: true },
          { name: "teamSize", label: { es: "Personas involucradas en ese triage", en: "People involved in that triage", pt: "Pessoas envolvidas nessa triagem" }, type: "number", placeholder: "2", required: true },
          { name: "hourlyRate", label: { es: "Costo promedio por hora de esas personas", en: "Average hourly cost of those people", pt: "Custo médio por hora dessas pessoas" }, type: "number", placeholder: "60", required: true },
          { name: "remediationDelayDays", label: { es: "Días extra que tarda en resolverse una vulnerabilidad crítica por falta de priorización clara", en: "Extra days it takes to resolve a critical vulnerability due to lack of clear prioritization", pt: "Dias extras para resolver uma vulnerabilidade crítica por falta de priorização clara" }, type: "number", placeholder: "21", required: true },
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
    title: { es: "Compliance con el EU Cyber Resilience Act", en: "Compliance with the EU Cyber Resilience Act", pt: "Conformidade com o EU Cyber Resilience Act" },
    shortDescription: { es: "Evalúe qué tan preparado está su producto de software frente a los requisitos esenciales, gestión de vulnerabilidades y obligaciones de reporte del Cyber Resilience Act (CRA) de la UE.", en: "Assess how prepared your software product is against the essential requirements, vulnerability management, and reporting obligations of the EU Cyber Resilience Act (CRA).", pt: "Avalie o nível de preparação do seu produto de software frente aos requisitos essenciais, gestão de vulnerabilidades e obrigações de reporte do Cyber Resilience Act (CRA) da UE." },
    complexity: "alta",
    estimatedTime: { es: "3 a 4 minutos", en: "3 to 4 minutes", pt: "3 a 4 minutos" },
    steps: [
      {
        id: "context",
        title: { es: "Su producto", en: "Your product", pt: "Seu produto" },
        description: { es: "Contexto regulatorio mínimo para calibrar la exposición.", en: "Minimal regulatory context to calibrate exposure.", pt: "Contexto regulatório mínimo para calibrar a exposição." },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector", pt: "Setor" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country", pt: "País" }, type: "select", options: COUNTRIES, required: true },
          { name: "productCategory", label: { es: "Categoría de su producto según el CRA", en: "Your product's category under the CRA", pt: "Categoria do seu produto conforme o CRA" }, type: "select", options: PRODUCT_CATEGORIES, tooltip: { es: "Los productos importantes y críticos (Anexo III/IV) requieren evaluación de conformidad por terceros.", en: "Important and critical products (Annex III/IV) require third-party conformity assessment.", pt: "Produtos importantes e críticos (Anexo III/IV) exigem avaliação de conformidade por terceiros." }, required: true },
          { name: "annualRevenue", label: { es: "Ingreso anual aproximado (USD)", en: "Approximate annual revenue (USD)", pt: "Receita anual aproximada (USD)" }, type: "number", placeholder: "5000000", required: true },
        ],
      },
      {
        id: "essential",
        title: { es: "Requisitos esenciales de ciberseguridad", en: "Essential cybersecurity requirements", pt: "Requisitos essenciais de cibersegurança" },
        description: { es: "Anexo I, Parte I del CRA: seguridad por diseño y por defecto.", en: "Annex I, Part I of the CRA: security by design and by default.", pt: "Anexo I, Parte I do CRA: segurança por design e por padrão." },
        fields: [
          { name: "secureByDesign", label: { es: "¿Su producto se diseña y desarrolla siguiendo principios de seguridad por diseño y por defecto?", en: "Is your product designed and developed following security-by-design and security-by-default principles?", pt: "Seu produto é projetado e desenvolvido seguindo princípios de segurança por design e por padrão?" }, type: "select", options: YES_NO_PARCIAL, required: true },
          { name: "noKnownVulnerabilities", label: { es: "¿Se libera sin vulnerabilidades explotables conocidas?", en: "Is it released without known exploitable vulnerabilities?", pt: "É lançado sem vulnerabilidades exploráveis conhecidas?" }, type: "select", options: YES_NO_PARCIAL, required: true },
          { name: "riskAssessment", label: { es: "¿Realiza una evaluación de riesgos de ciberseguridad documentada durante todo el ciclo de vida?", en: "Do you perform a documented cybersecurity risk assessment throughout the entire lifecycle?", pt: "Realiza uma avaliação documentada de riscos de cibersegurança ao longo de todo o ciclo de vida?" }, type: "select", options: YES_NO_PARCIAL, required: true },
          { name: "dataProtection", label: { es: "¿Protege la confidencialidad e integridad de los datos que procesa?", en: "Does it protect the confidentiality and integrity of the data it processes?", pt: "Protege a confidencialidade e a integridade dos dados que processa?" }, type: "select", options: YES_NO_PARCIAL, required: true },
        ],
      },
      {
        id: "vulnManagement",
        title: { es: "Gestión de vulnerabilidades", en: "Vulnerability management", pt: "Gestão de vulnerabilidades" },
        description: { es: "Anexo I, Parte II del CRA: manejo del ciclo de vida de vulnerabilidades.", en: "Annex I, Part II of the CRA: vulnerability lifecycle handling.", pt: "Anexo I, Parte II do CRA: tratamento do ciclo de vida de vulnerabilidades." },
        fields: [
          { name: "hasSbom", label: { es: "¿Genera y mantiene un SBOM (inventario de componentes de software)?", en: "Do you generate and maintain an SBOM (software bill of materials)?", pt: "Gera e mantém um SBOM (inventário de componentes de software)?" }, type: "select", options: YES_NO, required: true },
          { name: "hasDisclosurePolicy", label: { es: "¿Tiene una política de divulgación coordinada de vulnerabilidades?", en: "Do you have a coordinated vulnerability disclosure policy?", pt: "Possui uma política de divulgação coordenada de vulnerabilidades?" }, type: "select", options: YES_NO, required: true },
          { name: "patchDays", label: { es: "Tiempo promedio para publicar un parche tras detectar una vulnerabilidad (días)", en: "Average time to release a patch after detecting a vulnerability (days)", pt: "Tempo médio para publicar um patch após detectar uma vulnerabilidade (dias)" }, type: "number", placeholder: "30", required: true },
          { name: "supportYears", label: { es: "Años de soporte de seguridad comprometidos para el producto", en: "Years of committed security support for the product", pt: "Anos de suporte de segurança comprometidos para o produto" }, type: "number", placeholder: "5", required: true },
        ],
      },
      {
        id: "reporting",
        title: { es: "Reporte de incidentes y conformidad", en: "Incident reporting and conformity", pt: "Reporte de incidentes e conformidade" },
        description: { es: "Último paso: obligaciones de reporte y evaluación de conformidad.", en: "Last step: reporting obligations and conformity assessment.", pt: "Última etapa: obrigações de reporte e avaliação de conformidade." },
        fields: [
          { name: "hasIncidentProcess", label: { es: "¿Tiene un proceso para reportar una vulnerabilidad activamente explotada en menos de 24 horas a ENISA/CSIRT?", en: "Do you have a process to report an actively exploited vulnerability to ENISA/CSIRT within 24 hours?", pt: "Possui um processo para reportar uma vulnerabilidade ativamente explorada à ENISA/CSIRT em menos de 24 horas?" }, type: "select", options: YES_NO_PARCIAL, required: true },
          { name: "conformityDone", label: { es: "¿Completó su evaluación de conformidad y expediente técnico?", en: "Have you completed your conformity assessment and technical documentation?", pt: "Concluiu sua avaliação de conformidade e dossiê técnico?" }, type: "select", options: CONFORMITY_STATUS, required: true },
          { name: "hourlyRate", label: { es: "Costo promedio por hora de su equipo de seguridad/ingeniería", en: "Average hourly cost of your security/engineering team", pt: "Custo médio por hora da sua equipe de segurança/engenharia" }, type: "number", placeholder: "85", required: true },
          CURRENCY_FIELD,
          CONFIRM_FIELD,
        ],
      },
    ],
  },
  {
    id: "dora-compliance",
    slug: "compliance-dora",
    category: "compliance",
    title: {
      es: "Evaluación de cumplimiento con DORA",
      en: "DORA compliance assessment",
      pt: "Avaliação de conformidade com o DORA",
    },
    shortDescription: {
      es: "Evalúe su madurez de resiliencia operativa digital frente al Reglamento DORA de la UE: gobernanza de riesgos TIC, gestión de incidentes, pruebas de resiliencia y proveedores críticos.",
      en: "Assess your digital operational resilience maturity against the EU DORA Regulation: ICT risk governance, incident management, resilience testing, and critical providers.",
      pt: "Avalie sua maturidade de resiliência operacional digital frente ao Regulamento DORA da UE: governança de riscos de TIC, gestão de incidentes, testes de resiliência e provedores críticos.",
    },
    complexity: "alta",
    estimatedTime: { es: "4 a 5 minutos", en: "4 to 5 minutes", pt: "4 a 5 minutos" },
    steps: [
      {
        id: "context",
        title: { es: "Su entidad", en: "Your entity", pt: "Sua entidade" },
        description: {
          es: "Contexto regulatorio para calibrar la exposición bajo el Reglamento de Resiliencia Operativa Digital (DORA).",
          en: "Regulatory context to calibrate exposure under the Digital Operational Resilience Act (DORA).",
          pt: "Contexto regulatório para calibrar a exposição sob o Regulamento de Resiliência Operacional Digital (DORA).",
        },
        fields: [
          { name: "sector", label: { es: "Sector", en: "Sector", pt: "Setor" }, type: "select", options: SECTOR_OPTIONS, required: true },
          { name: "country", label: { es: "País", en: "Country", pt: "País" }, type: "select", options: COUNTRIES, required: true },
          {
            name: "entityType",
            label: { es: "Tipo de entidad financiera", en: "Financial entity type", pt: "Tipo de entidade financeira" },
            type: "select",
            options: [...DORA_ENTITY_TYPES],
            tooltip: {
              es: "DORA aplica a entidades financieras de la UE y a proveedores críticos de servicios TIC que les prestan servicios.",
              en: "DORA applies to EU financial entities and critical ICT third-party service providers that serve them.",
              pt: "O DORA aplica-se a entidades financeiras da UE e a provedores críticos de serviços TIC que as atendem.",
            },
            required: true,
          },
          { name: "annualRevenue", label: { es: "Ingreso anual aproximado (USD)", en: "Approximate annual revenue (USD)", pt: "Receita anual aproximada (USD)" }, type: "number", placeholder: "50000000", required: true },
        ],
      },
      {
        id: "governance",
        title: { es: "Marco de gestión de riesgos TIC", en: "ICT risk management framework", pt: "Framework de gestão de riscos de TIC" },
        description: {
          es: "Preguntas 1 a 4 — gobernanza, inventario de activos y controles de protección.",
          en: "Questions 1 to 4 — governance, asset inventory, and protection controls.",
          pt: "Perguntas 1 a 4 — governança, inventário de ativos e controles de proteção.",
        },
        fields: DORA_QUESTIONS.filter((q) => q.pillar === "governance").map(doraFieldFromQuestion),
      },
      {
        id: "incidents",
        title: { es: "Gestión de incidentes", en: "Incident management", pt: "Gestão de incidentes" },
        description: {
          es: "Preguntas 5 a 7 — detección, reporte y lecciones aprendidas.",
          en: "Questions 5 to 7 — detection, reporting, and lessons learned.",
          pt: "Perguntas 5 a 7 — detecção, reporte e lições aprendidas.",
        },
        fields: DORA_QUESTIONS.filter((q) => q.pillar === "incidents").map(doraFieldFromQuestion),
      },
      {
        id: "resilience",
        title: { es: "Pruebas de resiliencia", en: "Resilience testing", pt: "Testes de resiliência" },
        description: {
          es: "Preguntas 8 a 9 — escaneos, pruebas de penetración y remediación.",
          en: "Questions 8 to 9 — scans, penetration tests, and remediation.",
          pt: "Perguntas 8 a 9 — varreduras, testes de penetração e remediação.",
        },
        fields: DORA_QUESTIONS.filter((q) => q.pillar === "resilience").map(doraFieldFromQuestion),
      },
      {
        id: "third-party",
        title: { es: "Gestión de proveedores TIC", en: "ICT provider management", pt: "Gestão de provedores de TIC" },
        description: {
          es: "Preguntas 10 a 12 — contratos, concentración de riesgo e integración al marco de riesgos.",
          en: "Questions 10 to 12 — contracts, concentration risk, and integration into the risk framework.",
          pt: "Perguntas 10 a 12 — contratos, risco de concentração e integração ao framework de riscos.",
        },
        fields: DORA_QUESTIONS.filter((q) => q.pillar === "third-party").map(doraFieldFromQuestion),
      },
      {
        id: "culture",
        title: { es: "Gobernanza y cultura", en: "Governance and culture", pt: "Governança e cultura" },
        description: {
          es: "Preguntas 13 a 15 — inteligencia de amenazas, alineación estratégica y capacitación.",
          en: "Questions 13 to 15 — threat intelligence, strategic alignment, and training.",
          pt: "Perguntas 13 a 15 — inteligência de ameaças, alinhamento estratégico e capacitação.",
        },
        fields: DORA_QUESTIONS.filter((q) => q.pillar === "culture").map(doraFieldFromQuestion),
      },
      {
        id: "finalize",
        title: { es: "Finalizar evaluación", en: "Complete assessment", pt: "Finalizar avaliação" },
        description: {
          es: "Escala: 1 = no implementado; 5 = totalmente implementado, documentado, probado y revisado regularmente.",
          en: "Scale: 1 = not implemented; 5 = fully implemented, documented, tested, and reviewed regularly.",
          pt: "Escala: 1 = não implementado; 5 = totalmente implementado, documentado, testado e revisado regularmente.",
        },
        fields: [
          { name: "hourlyRate", label: { es: "Costo promedio por hora de su equipo de riesgo/seguridad", en: "Average hourly cost of your risk/security team", pt: "Custo médio por hora da sua equipe de risco/segurança" }, type: "number", placeholder: "95", required: true },
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