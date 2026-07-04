export type CalculatorId =
  | "iso-quality"
  | "owasp-web"
  | "owasp-mobile"
  | "sector"
  | "aspm-cost"
  | "cra-compliance";

export type RiskLevel = "bajo" | "moderado" | "alto" | "critico";

export type Currency = "USD" | "EUR" | "MXN" | "BRL" | "COP" | "CLP" | "PEN";

export type Locale = "es" | "en" | "pt";

export type CalculatorCategory = "seguridad" | "calidad" | "compliance" | "ahorros";

export interface LocalizedText {
  es: string;
  en: string;
  pt?: string;
}

export type RecommendationPriority = "critica" | "alta" | "media" | "baja";
export type EffortLevel = "bajo" | "medio" | "alto";
export type ImpactLevel = "bajo" | "medio" | "alto";
export type Timeframe = "inmediato" | "30-dias" | "60-dias" | "90-dias";
export type ResponsibleArea =
  | "desarrollo"
  | "seguridad"
  | "infraestructura"
  | "cumplimiento"
  | "direccion";
export type RecommendationType =
  | "tecnica"
  | "operativa"
  | "regulatoria"
  | "ejecutiva";

export interface Recommendation {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  priority: RecommendationPriority;
  effort: EffortLevel;
  impact: ImpactLevel;
  timeframe: Timeframe;
  area: ResponsibleArea;
  type: RecommendationType;
}

export interface ImpactMatrix {
  financial: number;
  technical: number;
  operational: number;
  regulatory: number;
  reputational: number;
}

export interface CostBreakdown {
  monthly?: number;
  annual?: number;
  min?: number;
  probable?: number;
  max?: number;
  perDeveloper?: number;
  remediation?: number;
  investigation?: number;
  interruption?: number;
  regulatory?: number;
  reputational?: number;
  opportunity?: number;
  monitoring?: number;
  items: { label: string; value: number }[];
}

export interface CalculationResult {
  id: string;
  calculatorId: CalculatorId;
  score: number;
  riskLevel: RiskLevel;
  cost: CostBreakdown;
  impactMatrix: ImpactMatrix;
  riskFactors: string[];
  recommendations: Recommendation[];
  immediateActions: Recommendation[];
  actions30Days: Recommendation[];
  actions90Days: Recommendation[];
  executiveSummary: string;
  partialSummary: string;
  inputs: Record<string, unknown>;
  currency: Currency;
  /** Set by calculate(); legacy results may omit this. */
  locale?: Locale;
  createdAt: string;
  leadCaptured: boolean;
  hoursPerYear?: number;
}

export interface LeadData {
  name: string;
  company: string;
  role: string;
  email: string;
  country: string;
  sector: string;
  appCount: string;
  wantsEmailReport: boolean;
}

export interface WizardStep {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  fields: WizardField[];
}

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "multiselect"
  | "radio"
  | "slider"
  | "checkbox";

export interface WizardField {
  name: string;
  label: LocalizedText;
  type: FieldType;
  tooltip?: LocalizedText;
  placeholder?: string;
  options?: { value: string; label: LocalizedText }[];
  min?: number;
  max?: number;
  required?: boolean;
  defaultValue?: string | number | boolean | string[];
}

export interface CalculatorConfig {
  id: CalculatorId;
  slug: string;
  category: CalculatorCategory;
  title: LocalizedText;
  shortDescription: LocalizedText;
  complexity: "baja" | "media" | "alta";
  estimatedTime: LocalizedText;
  steps: WizardStep[];
}