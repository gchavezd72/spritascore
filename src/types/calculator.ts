export type CalculatorId =
  | "iso-quality"
  | "owasp-web"
  | "owasp-mobile"
  | "sector";

export type RiskLevel = "bajo" | "moderado" | "alto" | "critico";

export type Currency = "USD" | "EUR" | "MXN" | "BRL" | "COP" | "CLP" | "PEN";

export type Locale = "es" | "en" | "pt";

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
  title: string;
  description: string;
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
  createdAt: string;
  leadCaptured: boolean;
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
  title: string;
  description: string;
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
  label: string;
  type: FieldType;
  tooltip?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  required?: boolean;
  defaultValue?: string | number | boolean | string[];
}

export interface CalculatorConfig {
  id: CalculatorId;
  slug: string;
  title: string;
  shortDescription: string;
  complexity: "baja" | "media" | "alta";
  estimatedTime: string;
  steps: WizardStep[];
}