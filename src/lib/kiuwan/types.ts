export const PRIORITIES = [
  "very-high",
  "high",
  "medium",
  "low",
  "very-low",
  "unknown",
] as const;

export type Priority = (typeof PRIORITIES)[number];

export type FindingKind = "vulnerability" | "defect" | "component-cve";

export type FindingSource = "csv" | "sarif" | "json";

export const KIUWAN_FILE_KINDS = [
  "vulnerabilities",
  "defects",
  "insight-security",
  "insight-components",
  "insight-license",
  "insight-obsolescence",
  "metrics",
  "sarif",
  "sbom",
  "unknown",
] as const;

export type KiuwanFileKind = (typeof KIUWAN_FILE_KINDS)[number];

export const QUALITY_ATTRIBUTES = [
  "efficiency",
  "maintainability",
  "portability",
  "reliability",
  "security",
] as const;

export type QualityAttributeKey = (typeof QUALITY_ATTRIBUTES)[number];

export interface Finding {
  id: string;
  kind: FindingKind;
  ruleCode: string;
  rule: string;
  priority: Priority;
  cwe: string[];
  characteristic: string;
  vulnerabilityType: string;
  language: string;
  effortMinutes: number;
  file: string;
  line: number | null;
  muted: boolean;
  status: string;
  normative: string[];
  cweScope: string;
  framework: string;
  source: FindingSource;
  buildArtifact: boolean;
}

export interface ComponentRecord {
  name: string;
  group: string;
  version: string;
  filename: string;
  language: string;
  licenseCount: number;
  licenses: string[];
  vulnerabilityCount: number;
  cves: string[];
  obsolescenceRisk: string;
  licenseRisk: string;
  securityRisk: string;
}

export interface ComponentCve {
  id: string;
  cve: string;
  cwe: string[];
  cvss: number | null;
  description: string;
  component: string;
  exploitability: number | null;
  impact: number | null;
  attackVector: string;
  muted: boolean;
  lastModified: string;
}

export interface LicenseRecord {
  license: string;
  component: string;
  spdx: string;
  type: string;
  risk: string;
  url: string;
  permissions: string[];
  limitations: string[];
  conditions: string[];
}

export interface ObsolescenceRecord {
  component: string;
  language: string;
  usedVersion: string;
  lastVersion: string;
  outOfDate: string;
  inactivity: string;
  obsolescenceRisk: string;
  risk: string;
}

export interface FileMetric {
  file: string;
  loc: number;
  allDefects: number;
  veryHigh: number;
  high: number;
  medium: number;
  low: number;
  veryLow: number;
  global: number | null;
  efficiency: number | null;
  maintainability: number | null;
  portability: number | null;
  reliability: number | null;
  security: number | null;
  complexity: number | null;
  effortTo100: number | null;
  duplicatedRatio: number | null;
}

export interface IngestedFile {
  name: string;
  kind: KiuwanFileKind;
  size: number;
  rowCount: number;
  warning?: string;
}

export interface AnalysisModel {
  files: IngestedFile[];
  findings: Finding[];
  components: ComponentRecord[];
  componentCves: ComponentCve[];
  licenses: LicenseRecord[];
  obsolescence: ObsolescenceRecord[];
  metrics: FileMetric[];
  application: {
    name: string | null;
    analyzedAt: string | null;
  };
}

export interface FunnelStage {
  id: string;
  label: string;
  count: number;
  hint: string;
}

export interface RankedVulnerability {
  rank: number;
  rule: string;
  ruleCode: string;
  priority: Priority;
  count: number;
  cwe: string[];
  vulnerabilityType: string;
  effortMinutes: number;
  files: number;
  languages: string[];
  characteristic: string;
}

export interface RankedComponentRisk {
  rank: number;
  name: string;
  version: string;
  securityRisk: string;
  licenseRisk: string;
  obsolescenceRisk: string;
  vulnerabilityCount: number;
  cves: string[];
  cvssMax: number | null;
  licenses: string[];
}

export interface QualityAttribute {
  key: QualityAttributeKey;
  label: string;
  score: number;
  defectCount: number;
}

export interface Improvement {
  area: string;
  rank: number;
  rule: string;
  ruleCode: string;
  count: number;
  priority: Priority;
  effortMinutes: number;
  files: number;
  languages: string[];
}

export interface ParseWarning {
  file: string;
  message: string;
}

export interface ParseResult {
  model: AnalysisModel;
  warnings: ParseWarning[];
}

export type SheetId = "resumen" | "seguridad" | "componentes" | "calidad";

export interface Selection {
  priorities: Priority[];
  languages: string[];
  characteristics: string[];
  types: string[];
  hideBuildArtifacts: boolean;
}
