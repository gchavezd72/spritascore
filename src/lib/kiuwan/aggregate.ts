import { formatEffort, isIdentifiableComponent, priorityRank, riskRank } from "./normalize";
import type {
  AnalysisModel,
  Finding,
  FunnelStage,
  Improvement,
  IngestedFile,
  KiuwanFileKind,
  QualityAttribute,
  QualityAttributeKey,
  RankedComponentRisk,
  RankedVulnerability,
  Selection,
} from "./types";

export const ATTRIBUTE_LABELS: Record<QualityAttributeKey, string> = {
  efficiency: "Eficiencia",
  maintainability: "Mantenibilidad",
  portability: "Portabilidad",
  reliability: "Fiabilidad",
  security: "Seguridad",
};

export function defaultSelection(): Selection {
  return {
    priorities: [],
    languages: [],
    characteristics: [],
    types: [],
    hideBuildArtifacts: true,
  };
}

export function applySelection(model: AnalysisModel, selection: Selection): Finding[] {
  return model.findings.filter((finding) => {
    if (selection.hideBuildArtifacts && finding.buildArtifact) return false;
    if (selection.priorities.length && !selection.priorities.includes(finding.priority)) return false;
    if (selection.languages.length && !selection.languages.includes(finding.language || "—")) return false;
    if (
      selection.characteristics.length &&
      !selection.characteristics.includes(finding.characteristic || "Sin clasificar")
    ) {
      return false;
    }
    if (selection.types.length && !selection.types.includes(finding.vulnerabilityType || "—")) return false;
    return true;
  });
}

export function applicationFindings(findings: Finding[]): Finding[] {
  return findings.filter((finding) => finding.kind === "vulnerability");
}

export function qualityFindings(findings: Finding[]): Finding[] {
  return findings.filter((finding) => finding.kind === "defect");
}

export function filePresence(files: IngestedFile[]): Record<KiuwanFileKind, boolean> {
  const present = {} as Record<KiuwanFileKind, boolean>;
  for (const kind of [
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
  ] as KiuwanFileKind[]) {
    present[kind] = files.some((file) => file.kind === kind);
  }
  return present;
}

export function applicationFunnel(findings: Finding[]): {
  stages: FunnelStage[];
  top10: RankedVulnerability[];
} {
  const vulns = applicationFindings(findings);
  const top10 = rankVulnerabilities(vulns).slice(0, 10);
  const highPlus = vulns.filter((item) => priorityRank(item.priority) >= 4);
  const uniqueRules = new Set(vulns.map((item) => item.ruleCode || item.rule)).size;

  const stages: FunnelStage[] = [
    {
      id: "all",
      label: "Hallazgos de aplicación",
      count: vulns.length,
      hint: "Vulnerabilidades SAST del análisis de aplicación",
    },
    {
      id: "unique",
      label: "Reglas distintas",
      count: uniqueRules,
      hint: "Tipos de vulnerabilidad únicos",
    },
    {
      id: "high",
      label: "Alta y muy alta",
      count: highPlus.length,
      hint: "Prioridad High / Very High",
    },
    {
      id: "top10",
      label: "10 más críticas",
      count: top10.length,
      hint: "Las 10 reglas de mayor severidad",
    },
  ];

  return { stages, top10 };
}

export function componentFunnel(model: AnalysisModel): {
  stages: FunnelStage[];
  top10: RankedComponentRisk[];
} {
  const components = model.components;
  const identifiable = components.filter(
    (component) =>
      isIdentifiableComponent(component.name) ||
      component.vulnerabilityCount > 0 ||
      component.licenses.length > 0
  );
  const cves = model.componentCves.filter((cve) => !cve.muted);
  const risky = components.filter(
    (component) =>
      component.vulnerabilityCount > 0 ||
      component.cves.length > 0 ||
      cves.some((cve) => cve.component === component.name) ||
      riskRank(component.securityRisk) >= 3 ||
      riskRank(component.licenseRisk) >= 3 ||
      riskRank(component.obsolescenceRisk) >= 3
  );
  const ranked = rankComponents(model);
  const pool = risky.length > 0 ? ranked.filter((item) => risky.some((component) => component.name === item.name)) : ranked;
  const top10 = pool.slice(0, 10);

  const stages = monotonicStages([
    {
      id: "components",
      label: "Componentes de terceros",
      count: components.length,
      hint: "Inventario SCA / SBOM",
    },
    {
      id: "identifiable",
      label: "Identificables",
      count: identifiable.length,
      hint: "Nombre, licencia o CVE",
    },
    {
      id: "cves",
      label: "Con CVE o riesgo alto",
      count: Math.max(cves.length, risky.length),
      hint: model.files.some((file) => file.kind === "insight-security")
        ? "Desde INSIGHT_SECURITY"
        : "Archivo de seguridad SCA no cargado",
    },
    {
      id: "top10",
      label: "10 más críticos",
      count: top10.length,
      hint: "La parte más delgada del embudo",
    },
  ]);

  return { stages, top10 };
}

function monotonicStages(stages: FunnelStage[]): FunnelStage[] {
  const result: FunnelStage[] = [];
  for (const stage of stages) {
    if (stage.count <= 0 && result.length > 0) continue;
    const previous = result.at(-1);
    if (previous && stage.count > previous.count) {
      result.push({ ...stage, count: previous.count });
      continue;
    }
    result.push(stage);
  }
  return result;
}

export function rankVulnerabilities(findings: Finding[]): RankedVulnerability[] {
  const groups = new Map<string, Finding[]>();
  for (const finding of findings) {
    const key = finding.ruleCode || finding.rule;
    const list = groups.get(key) ?? [];
    list.push(finding);
    groups.set(key, list);
  }

  const ranked = [...groups.values()].map((group) => {
    const sample = [...group].sort((a, b) => priorityRank(b.priority) - priorityRank(a.priority))[0];
    return {
      rank: 0,
      rule: sample.rule,
      ruleCode: sample.ruleCode,
      priority: sample.priority,
      count: group.length,
      cwe: unique(group.flatMap((item) => item.cwe)),
      vulnerabilityType: sample.vulnerabilityType,
      effortMinutes: group.reduce((sum, item) => sum + item.effortMinutes, 0),
      files: new Set(group.map((item) => item.file)).size,
      languages: unique(group.map((item) => item.language).filter(Boolean)),
      characteristic: sample.characteristic || "Security",
    } satisfies RankedVulnerability;
  });

  ranked.sort((a, b) => {
    const priority = priorityRank(b.priority) - priorityRank(a.priority);
    if (priority !== 0) return priority;
    if (b.count !== a.count) return b.count - a.count;
    return b.effortMinutes - a.effortMinutes;
  });

  return ranked.map((item, index) => ({ ...item, rank: index + 1 }));
}

export function rankComponents(model: AnalysisModel): RankedComponentRisk[] {
  const cvesByComponent = new Map<string, number>();
  for (const cve of model.componentCves) {
    const current = cvesByComponent.get(cve.component) ?? 0;
    cvesByComponent.set(cve.component, Math.max(current, cve.cvss ?? 0));
  }

  const ranked = model.components.map((component) => {
    const cvssMax =
      cvesByComponent.get(component.name) ??
      cvesByComponent.get(`${component.group}:${component.name}`) ??
      (component.cves.length ? 0 : null);
    return {
      rank: 0,
      name: component.name,
      version: component.version,
      securityRisk: component.securityRisk,
      licenseRisk: component.licenseRisk,
      obsolescenceRisk: component.obsolescenceRisk,
      vulnerabilityCount: component.vulnerabilityCount,
      cves: component.cves,
      cvssMax,
      licenses: component.licenses,
    } satisfies RankedComponentRisk;
  });

  ranked.sort((a, b) => {
    const score =
      (b.vulnerabilityCount - a.vulnerabilityCount) * 10 +
      ((b.cvssMax ?? 0) - (a.cvssMax ?? 0)) +
      (riskRank(b.securityRisk) - riskRank(a.securityRisk)) * 3 +
      (riskRank(b.licenseRisk) - riskRank(a.licenseRisk)) +
      (riskRank(b.obsolescenceRisk) - riskRank(a.obsolescenceRisk));
    if (score !== 0) return score > 0 ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  return ranked.map((item, index) => ({ ...item, rank: index + 1 }));
}

export function qualityRadar(model: AnalysisModel, findings: Finding[]): QualityAttribute[] {
  const weighted = weightedIndicators(model);
  const defectCounts = countByArea(qualityFindings(findings).concat(applicationFindings(findings)));

  return (Object.keys(ATTRIBUTE_LABELS) as QualityAttributeKey[]).map((key) => ({
    key,
    label: ATTRIBUTE_LABELS[key],
    score: weighted[key],
    defectCount: defectCounts[attributeToArea(key)] ?? 0,
  }));
}

function attributeToArea(key: QualityAttributeKey): string {
  switch (key) {
    case "efficiency":
      return "Efficiency";
    case "maintainability":
      return "Maintainability";
    case "portability":
      return "Portability";
    case "reliability":
      return "Reliability";
    case "security":
      return "Security";
  }
}

function weightedIndicators(model: AnalysisModel): Record<QualityAttributeKey, number> {
  const sums: Record<QualityAttributeKey, { weight: number; total: number }> = {
    efficiency: { weight: 0, total: 0 },
    maintainability: { weight: 0, total: 0 },
    portability: { weight: 0, total: 0 },
    reliability: { weight: 0, total: 0 },
    security: { weight: 0, total: 0 },
  };

  for (const metric of model.metrics) {
    const weight = metric.loc > 0 ? metric.loc : 1;
    (Object.keys(sums) as QualityAttributeKey[]).forEach((key) => {
      const value = metric[key];
      if (value === null) return;
      sums[key].total += value * weight;
      sums[key].weight += weight;
    });
  }

  const result = {} as Record<QualityAttributeKey, number>;
  (Object.keys(sums) as QualityAttributeKey[]).forEach((key) => {
    result[key] = sums[key].weight > 0 ? round1(sums[key].total / sums[key].weight) : scoreFromDefects(model, key);
  });
  return result;
}

function scoreFromDefects(model: AnalysisModel, key: QualityAttributeKey): number {
  const area = attributeToArea(key);
  const relevant = model.findings.filter((finding) => finding.characteristic === area && !finding.buildArtifact);
  if (model.findings.length === 0) return 0;
  const penalty = relevant.reduce((sum, finding) => sum + priorityRank(finding.priority), 0);
  return Math.max(0, round1(100 - Math.min(90, penalty * 1.5)));
}

export function improvementsByArea(findings: Finding[]): Record<string, Improvement[]> {
  const areas = ["Security", "Reliability", "Maintainability", "Efficiency", "Portability"];
  const extra = unique(
    findings
      .map((finding) => finding.characteristic)
      .filter((area) => area && !areas.includes(area))
  );
  const result: Record<string, Improvement[]> = {};
  for (const area of [...areas, ...extra]) {
    const ofArea = findings.filter((finding) => (finding.characteristic || "Sin clasificar") === area);
    if (ofArea.length === 0) {
      result[area] = [];
      continue;
    }
    const ranked = rankVulnerabilities(ofArea).slice(0, 10);
    result[area] = ranked.map((item) => ({
      area,
      rank: item.rank,
      rule: item.rule,
      ruleCode: item.ruleCode,
      count: item.count,
      priority: item.priority,
      effortMinutes: item.effortMinutes,
      files: item.files,
      languages: item.languages,
    }));
  }
  return result;
}

export function countBy(values: string[]): Array<{ name: string; value: number }> {
  const map = new Map<string, number>();
  for (const value of values) {
    const key = value || "—";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function countByArea(findings: Finding[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const finding of findings) {
    const area = finding.characteristic || "Sin clasificar";
    map[area] = (map[area] ?? 0) + 1;
  }
  return map;
}

export function hotspotFiles(findings: Finding[], limit = 8): Array<{ file: string; count: number; effort: number }> {
  const map = new Map<string, { count: number; effort: number }>();
  for (const finding of findings) {
    if (!finding.file) continue;
    const current = map.get(finding.file) ?? { count: 0, effort: 0 };
    current.count += 1;
    current.effort += finding.effortMinutes;
    map.set(finding.file, current);
  }
  return [...map.entries()]
    .map(([file, stats]) => ({ file, ...stats }))
    .sort((a, b) => b.count - a.count || b.effort - a.effort)
    .slice(0, limit);
}

export function totalEffort(findings: Finding[]): number {
  return findings.reduce((sum, finding) => sum + finding.effortMinutes, 0);
}

export interface ExecutiveSnapshot {
  score: number;
  label: "Crítico" | "Alto" | "Moderado" | "Controlado";
  narrative: string;
  securityFile: { present: boolean; empty: boolean; name: string | null };
  appVulns: number;
  componentCves: number;
  qualityIndex: number;
  effortLabel: string;
}

export function executiveSnapshot(model: AnalysisModel, findings: Finding[]): ExecutiveSnapshot {
  const presence = filePresence(model.files);
  const securityFile = model.files.find((file) => file.kind === "insight-security");
  const app = applicationFindings(findings);
  const quality = qualityRadar(model, findings);
  const qualityIndex =
    quality.length > 0 ? round1(quality.reduce((sum, item) => sum + item.score, 0) / quality.length) : 0;
  const highApp = app.filter((item) => priorityRank(item.priority) >= 4).length;
  const cves = model.componentCves.length;
  const componentsAtRisk = model.components.filter(
    (component) => riskRank(component.securityRisk) >= 3 || component.vulnerabilityCount > 0
  ).length;

  const penalty = Math.min(70, highApp * 1.2 + cves * 4 + componentsAtRisk * 2 + Math.max(0, 80 - qualityIndex) * 0.4);
  const score = Math.max(0, Math.min(100, round1(100 - penalty)));
  const label: ExecutiveSnapshot["label"] =
    score < 40 ? "Crítico" : score < 60 ? "Alto" : score < 80 ? "Moderado" : "Controlado";

  const missingApp = !presence.vulnerabilities && !model.findings.some((item) => item.kind === "vulnerability");
  const narrativeParts: string[] = [];
  if (missingApp) {
    narrativeParts.push("No hay archivo de vulnerabilidades de aplicación (CSV o SARIF).");
  } else {
    narrativeParts.push(
      `${app.length} hallazgos de seguridad de aplicación; ${highApp} con prioridad alta o muy alta.`
    );
  }
  if (!securityFile) {
    narrativeParts.push("Falta INSIGHT_SECURITY: no se puede confirmar el riesgo CVE de terceros.");
  } else if (securityFile.rowCount === 0) {
    narrativeParts.push("INSIGHT_SECURITY está presente y no reporta CVEs en componentes.");
  } else {
    narrativeParts.push(`${cves} CVE de componentes de terceros.`);
  }
  narrativeParts.push(`Índice de calidad ponderado por LOC: ${qualityIndex}/100.`);

  return {
    score,
    label,
    narrative: narrativeParts.join(" "),
    securityFile: {
      present: Boolean(securityFile),
      empty: Boolean(securityFile && securityFile.rowCount === 0),
      name: securityFile?.name ?? null,
    },
    appVulns: app.length,
    componentCves: cves,
    qualityIndex,
    effortLabel: formatEffort(totalEffort(findings)),
  };
}

export function distinct(findings: Finding[], key: (finding: Finding) => string): string[] {
  return unique(findings.map(key)).sort((a, b) => a.localeCompare(b));
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export type SeverityBucket = "critical" | "high" | "medium" | "low";

export interface CategorySeverityRow {
  category: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
  effort: number;
}

export function severityBucket(priority: Finding["priority"]): SeverityBucket {
  if (priority === "very-high") return "critical";
  if (priority === "high") return "high";
  if (priority === "medium") return "medium";
  return "low";
}

export function categorizeFinding(finding: Finding): string {
  const hay = `${finding.rule} ${finding.ruleCode} ${finding.characteristic} ${finding.vulnerabilityType}`.toLowerCase();
  if (/dead code/.test(hay)) return "Codigo muerto";
  if (/duplicat/.test(hay)) return "Codigo duplicado";
  if (/exception|error handling|throwable|fault isolation/.test(hay)) return "Manejo de errores";
  if (/cyclomatic|nested if|too many param|complexity/.test(hay)) return "Complejidad";
  if (/noscript|100kb|efficiency|instantiation into loops/.test(hay)) return "Rendimiento";
  if (/backup|debuggable|permission|exported|misconfig/.test(hay)) return "Configuracion";
  if (finding.kind === "vulnerability" || /injection|xss|secret|security/.test(hay)) return "Seguridad";
  if (/maintain/.test(hay) || finding.characteristic === "Maintainability") return "Mantenibilidad";
  if (finding.characteristic === "Reliability") return "Manejo de errores";
  if (finding.characteristic === "Efficiency") return "Rendimiento";
  if (finding.characteristic === "Portability") return "Portabilidad";
  return "Convenciones";
}

export function defectsByCategoryAndSeverity(
  findings: Finding[],
  groupBy: "category" | "language" = "category"
): CategorySeverityRow[] {
  const map = new Map<string, CategorySeverityRow>();
  for (const finding of findings) {
    const key = groupBy === "language" ? finding.language || "—" : categorizeFinding(finding);
    const row = map.get(key) ?? {
      category: key,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: 0,
      effort: 0,
    };
    const bucket = severityBucket(finding.priority);
    row[bucket] += 1;
    row.total += 1;
    row.effort += finding.effortMinutes;
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => b.critical + b.high - (a.critical + a.high) || b.total - a.total);
}

export function effortByCategoryAndSeverity(
  findings: Finding[],
  groupBy: "category" | "language" = "category"
): CategorySeverityRow[] {
  const map = new Map<string, CategorySeverityRow>();
  for (const finding of findings) {
    const key = groupBy === "language" ? finding.language || "—" : categorizeFinding(finding);
    const row = map.get(key) ?? {
      category: key,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: 0,
      effort: 0,
    };
    const minutes = finding.effortMinutes || 0;
    const bucket = severityBucket(finding.priority);
    row[bucket] += minutes;
    row.total += minutes;
    row.effort += minutes;
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export { formatEffort };
