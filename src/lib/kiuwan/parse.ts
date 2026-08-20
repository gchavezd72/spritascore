import { cell, parseCsv, splitList } from "./csv";
import { classifyByFilename, classifyByHeaders, classifyJson, isRecord } from "./classify";
import {
  extractAnalysisTimestamp,
  extractApplicationName,
  isBuildArtifact,
  parseBoolean,
  parseCount,
  parseCwes,
  parseEffortMinutes,
  parseNormative,
  parseNumber,
  parsePriority,
  sarifLevelToPriority,
  slugId,
} from "./normalize";
import type {
  AnalysisModel,
  ComponentCve,
  ComponentRecord,
  FileMetric,
  Finding,
  IngestedFile,
  LicenseRecord,
  ObsolescenceRecord,
  ParseResult,
  ParseWarning,
} from "./types";

export const MAX_FILE_BYTES = 15 * 1024 * 1024;
export const MAX_FILES = 20;
export const MAX_TOTAL_BYTES = 40 * 1024 * 1024;

export interface SourceFile {
  name: string;
  size: number;
  text: string;
}

export function parseKiuwanFiles(files: SourceFile[]): ParseResult {
  const warnings: ParseWarning[] = [];
  const ingested: IngestedFile[] = [];
  const findings: Finding[] = [];
  const components: ComponentRecord[] = [];
  const componentCves: ComponentCve[] = [];
  const licenses: LicenseRecord[] = [];
  const obsolescence: ObsolescenceRecord[] = [];
  const metrics: FileMetric[] = [];
  const timestamps: string[] = [];

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      warnings.push({
        file: file.name,
        message: `Archivo omitido: supera el límite de ${Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB.`,
      });
      continue;
    }

    const nameKind = classifyByFilename(file.name);
    const timestamp = extractAnalysisTimestamp(file.name);
    if (timestamp) timestamps.push(timestamp);

    try {
      if (looksLikeJson(file.name, file.text)) {
        const parsed = parseJsonSafe(file.text);
        if (parsed === undefined) {
          warnings.push({ file: file.name, message: "JSON inválido o truncado." });
          continue;
        }
        const kind = classifyJson(parsed, file.name);
        if (kind === "sarif") {
          const fromSarif = parseSarif(parsed, file.name);
          findings.push(...fromSarif.findings);
          ingested.push({
            name: file.name,
            kind: "sarif",
            size: file.size,
            rowCount: fromSarif.findings.length,
            warning: fromSarif.warning,
          });
          if (fromSarif.warning) warnings.push({ file: file.name, message: fromSarif.warning });
          continue;
        }
        if (kind === "sbom") {
          const fromSbom = parseSbom(parsed);
          components.push(...fromSbom);
          ingested.push({
            name: file.name,
            kind: "sbom",
            size: file.size,
            rowCount: fromSbom.length,
          });
          continue;
        }
        warnings.push({ file: file.name, message: "JSON reconocido pero no es SARIF ni CycloneDX." });
        ingested.push({ name: file.name, kind: "unknown", size: file.size, rowCount: 0 });
        continue;
      }

      const csv = parseCsv(file.text);
      const kind = nameKind !== "unknown" ? nameKind : classifyByHeaders(csv.headers);
      ingested.push({
        name: file.name,
        kind,
        size: file.size,
        rowCount: csv.rows.length,
        warning: kind === "unknown" ? "No se reconoció el formato de análisis." : undefined,
      });

      if (kind === "unknown") {
        warnings.push({
          file: file.name,
          message: "Cabeceras no coinciden con un export de análisis conocido.",
        });
        continue;
      }

      if (kind === "vulnerabilities") {
        findings.push(...csv.rows.map((row, index) => rowToFinding(row, "vulnerability", "csv", file.name, index)));
      } else if (kind === "defects") {
        findings.push(...csv.rows.map((row, index) => rowToFinding(row, "defect", "csv", file.name, index)));
      } else if (kind === "insight-security") {
        const cves = csv.rows
          .map((row, index) => rowToCve(row, index))
          .filter((item): item is ComponentCve => item !== null);
        componentCves.push(...cves);
        if (csv.rows.length === 0) {
          ingested[ingested.length - 1].warning = "El archivo de seguridad SCA está presente pero no contiene CVEs.";
        }
      } else if (kind === "insight-components") {
        components.push(...csv.rows.map(rowToComponent));
      } else if (kind === "insight-license") {
        licenses.push(...csv.rows.map(rowToLicense));
      } else if (kind === "insight-obsolescence") {
        obsolescence.push(...csv.rows.map(rowToObsolescence));
      } else if (kind === "metrics") {
        metrics.push(...csv.rows.map(rowToMetric));
      }
    } catch {
      warnings.push({ file: file.name, message: "No se pudo leer el archivo." });
    }
  }

  const model: AnalysisModel = {
    files: ingested,
    findings: dedupeFindings(findings),
    components: mergeComponents(components),
    componentCves,
    licenses,
    obsolescence,
    metrics,
    application: {
      name: extractApplicationName(findings.map((item) => item.file)),
      analyzedAt: timestamps.sort().at(-1) ?? null,
    },
  };

  return { model, warnings };
}

function looksLikeJson(filename: string, text: string): boolean {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".json") || lower.endsWith(".sarif")) return true;
  const trimmed = text.trimStart();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

function parseJsonSafe(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function rowToFinding(
  row: Record<string, string>,
  kind: Finding["kind"],
  source: Finding["source"],
  origin: string,
  index: number
): Finding {
  const file = cell(row, "File", "file", "Source file");
  const lineRaw = cell(row, "Line number", "Source line number");
  const line = parseNumber(lineRaw);
  const ruleCode = cell(row, "Rule code", "ruleId");
  const rule = cell(row, "Rule") || ruleCode;
  const characteristic = cell(row, "Software characteristic");
  const inferredKind: Finding["kind"] =
    kind === "defect" && characteristic.toLowerCase() === "security" ? "vulnerability" : kind;

  return {
    id: slugId([inferredKind, origin, ruleCode, file, lineRaw, index]),
    kind: inferredKind,
    ruleCode,
    rule,
    priority: parsePriority(cell(row, "Priority")),
    cwe: parseCwes(cell(row, "CWE")),
    characteristic,
    vulnerabilityType: cell(row, "Vulnerability type"),
    language: cell(row, "Language", "Languaje"),
    effortMinutes: parseEffortMinutes(cell(row, "Effort")),
    file,
    line: line !== null ? Math.round(line) : null,
    muted: parseBoolean(cell(row, "Muted")),
    status: cell(row, "Status"),
    normative: parseNormative(cell(row, "Normative")),
    cweScope: cell(row, "CWE Scope").replace(/^CWEScope:/i, ""),
    framework: cell(row, "Framework").replace(/^Framework:/i, ""),
    source,
    buildArtifact: isBuildArtifact(file),
  };
}

function rowToComponent(row: Record<string, string>): ComponentRecord {
  return {
    name: cell(row, "Component"),
    group: cell(row, "Group"),
    version: cell(row, "Version"),
    filename: cell(row, "Filename"),
    language: cell(row, "Language", "Languaje"),
    licenseCount: parseCount(cell(row, "#Licenses")),
    licenses: splitList(cell(row, "Licenses")),
    vulnerabilityCount: parseCount(cell(row, "#Vulnerabilities")),
    cves: splitList(cell(row, "CVE")),
    obsolescenceRisk: cell(row, "Obsolescence risk") || "Unknown",
    licenseRisk: cell(row, "License risk") || "Unknown",
    securityRisk: cell(row, "Security risk") || "Unknown",
  };
}

function rowToCve(row: Record<string, string>, index: number): ComponentCve | null {
  const cve = cell(row, "CVE");
  if (!cve) return null;
  return {
    id: slugId(["cve", cve, cell(row, "Component"), index]),
    cve,
    cwe: parseCwes(cell(row, "CWE")),
    cvss: parseNumber(cell(row, "CVSS Base Score")),
    description: cell(row, "Description"),
    component: cell(row, "Component"),
    exploitability: parseNumber(cell(row, "Exploitability Subscore")),
    impact: parseNumber(cell(row, "Impact Subscore")),
    attackVector: cell(row, "Attack vector(V3)", "Attack vector(V2)"),
    muted: parseBoolean(cell(row, "Mute")),
    lastModified: cell(row, "Last modified"),
  };
}

function rowToLicense(row: Record<string, string>): LicenseRecord {
  return {
    license: cell(row, "License"),
    component: cell(row, "Component"),
    spdx: cell(row, "SPDX code", "Type"),
    type: cell(row, "Type"),
    risk: cell(row, "Risk") || "unknown",
    url: cell(row, "URL"),
    permissions: splitList(cell(row, "Permissions")),
    limitations: splitList(cell(row, "Limitations")),
    conditions: splitList(cell(row, "Conditions")),
  };
}

function rowToObsolescence(row: Record<string, string>): ObsolescenceRecord {
  const component = cell(row, "Component");
  const [name] = component.split(":");
  return {
    component: name || component,
    language: cell(row, "Languaje", "Language"),
    usedVersion: cell(row, "Used version"),
    lastVersion: cell(row, "Last version"),
    outOfDate: cell(row, "Out of date"),
    inactivity: cell(row, "Time inactivity"),
    obsolescenceRisk: cell(row, "Obsolescence risk"),
    risk: cell(row, "Risk"),
  };
}

function rowToMetric(row: Record<string, string>): FileMetric {
  return {
    file: cell(row, "File"),
    loc: parseCount(cell(row, "Lines of code")),
    allDefects: parseCount(cell(row, "All defects")),
    veryHigh: parseCount(cell(row, "Very high priority defects")),
    high: parseCount(cell(row, "High priority defects")),
    medium: parseCount(cell(row, "Medium priority defects")),
    low: parseCount(cell(row, "Low priority defects")),
    veryLow: parseCount(cell(row, "Very low priority defects")),
    global: parseNumber(cell(row, "Global indicator")),
    efficiency: parseNumber(cell(row, "Efficiency indicator")),
    maintainability: parseNumber(cell(row, "Maintainability indicator")),
    portability: parseNumber(cell(row, "Portability indicator")),
    reliability: parseNumber(cell(row, "Reliability  indicator", "Reliability indicator")),
    security: parseNumber(cell(row, "Security indicator")),
    complexity: parseNumber(cell(row, "Cyclomatic complexity")),
    effortTo100: parseNumber(cell(row, "Total effort to 100")),
    duplicatedRatio: parseNumber(cell(row, "Duplicated code ratio")),
  };
}

function parseSarif(value: unknown, origin: string): { findings: Finding[]; warning?: string } {
  if (!isRecord(value) || !Array.isArray(value.runs)) {
    return { findings: [], warning: "SARIF sin runs." };
  }

  const findings: Finding[] = [];
  for (const run of value.runs) {
    if (!isRecord(run) || !Array.isArray(run.results)) continue;
    const ruleMap = sarifRuleMap(run);
    run.results.forEach((result, index) => {
      if (!isRecord(result)) return;
      const ruleId = typeof result.ruleId === "string" ? result.ruleId : "";
      const message = sarifMessage(result.message);
      const location = firstLocation(result.locations);
      const file = location.uri;
      const kind: Finding["kind"] = isSecurityRule(ruleId, message) ? "vulnerability" : "defect";
      findings.push({
        id: slugId(["sarif", origin, ruleId, file, location.line, index]),
        kind,
        ruleCode: ruleId,
        rule: message.replace(/^[A-Za-z0-9_.]+:\s*/, "") || ruleMap.get(ruleId) || ruleId,
        priority: sarifLevelToPriority(typeof result.level === "string" ? result.level : undefined),
        cwe: [],
        characteristic: kind === "vulnerability" ? "Security" : "",
        vulnerabilityType: "",
        language: "",
        effortMinutes: 0,
        file,
        line: location.line,
        muted: false,
        status: "",
        normative: [],
        cweScope: "",
        framework: "",
        source: "sarif",
        buildArtifact: isBuildArtifact(file),
      });
    });
  }

  return { findings };
}

function sarifRuleMap(run: Record<string, unknown>): Map<string, string> {
  const map = new Map<string, string>();
  const tool = isRecord(run.tool) ? run.tool : null;
  const driver = tool && isRecord(tool.driver) ? tool.driver : null;
  const rules = driver && Array.isArray(driver.rules) ? driver.rules : [];
  for (const rule of rules) {
    if (!isRecord(rule) || typeof rule.id !== "string") continue;
    const short = isRecord(rule.shortDescription) ? rule.shortDescription : null;
    const text = short && typeof short.text === "string" ? short.text : rule.id;
    map.set(rule.id, text);
  }
  return map;
}

function sarifMessage(message: unknown): string {
  if (!isRecord(message)) return "";
  if (typeof message.text === "string") return message.text;
  if (typeof message.markdown === "string") return message.markdown.replace(/[*_`]/g, "");
  return "";
}

function firstLocation(locations: unknown): { uri: string; line: number | null } {
  if (!Array.isArray(locations) || locations.length === 0) return { uri: "", line: null };
  const first = locations[0];
  if (!isRecord(first)) return { uri: "", line: null };
  const physical = isRecord(first.physicalLocation) ? first.physicalLocation : null;
  const artifact = physical && isRecord(physical.artifactLocation) ? physical.artifactLocation : null;
  const region = physical && isRecord(physical.region) ? physical.region : null;
  const uri = artifact && typeof artifact.uri === "string" ? artifact.uri : "";
  const line = region && typeof region.startLine === "number" ? region.startLine : null;
  return { uri, line };
}

function isSecurityRule(ruleId: string, message: string): boolean {
  const haystack = `${ruleId} ${message}`.toLowerCase();
  return (
    haystack.includes("security") ||
    haystack.includes("vulnerab") ||
    haystack.includes("injection") ||
    haystack.includes("permission") ||
    haystack.includes("xss") ||
    haystack.includes("backup") ||
    haystack.includes("secret")
  );
}

function parseSbom(value: unknown): ComponentRecord[] {
  if (!isRecord(value) || !Array.isArray(value.components)) return [];
  return value.components
    .filter(isRecord)
    .map((component) => {
      const name = typeof component.name === "string" ? component.name : "";
      const group = typeof component.group === "string" ? component.group : "";
      const version = typeof component.version === "string" ? component.version : "";
      const licenses = Array.isArray(component.licenses)
        ? component.licenses
            .map((entry) => {
              if (!isRecord(entry)) return "";
              if (isRecord(entry.license)) {
                if (typeof entry.license.id === "string") return entry.license.id;
                if (typeof entry.license.name === "string") return entry.license.name;
              }
              return "";
            })
            .filter(Boolean)
        : [];
      return {
        name,
        group,
        version,
        filename: "",
        language: "",
        licenseCount: licenses.length,
        licenses,
        vulnerabilityCount: 0,
        cves: [],
        obsolescenceRisk: "Unknown",
        licenseRisk: "Unknown",
        securityRisk: "Unknown",
      };
    })
    .filter((component) => component.name);
}

function dedupeFindings(findings: Finding[]): Finding[] {
  const map = new Map<string, Finding>();
  for (const finding of findings) {
    const key = [
      finding.kind,
      finding.ruleCode || finding.rule,
      finding.file,
      finding.line ?? "",
    ].join("|");
    const existing = map.get(key);
    if (!existing) {
      map.set(key, finding);
      continue;
    }
    map.set(key, mergeFinding(existing, finding));
  }
  return [...map.values()];
}

function mergeFinding(a: Finding, b: Finding): Finding {
  const preferred = a.source === "csv" ? a : b.source === "csv" ? b : a;
  const other = preferred === a ? b : a;
  return {
    ...preferred,
    cwe: unique(preferred.cwe.concat(other.cwe)),
    normative: unique(preferred.normative.concat(other.normative)),
    vulnerabilityType: preferred.vulnerabilityType || other.vulnerabilityType,
    language: preferred.language || other.language,
    characteristic: preferred.characteristic || other.characteristic,
    effortMinutes: preferred.effortMinutes || other.effortMinutes,
    framework: preferred.framework || other.framework,
    cweScope: preferred.cweScope || other.cweScope,
  };
}

function mergeComponents(components: ComponentRecord[]): ComponentRecord[] {
  const map = new Map<string, ComponentRecord>();
  for (const component of components) {
    const key = `${component.group}|${component.name}|${component.version}|${component.filename}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, component);
      continue;
    }
    map.set(key, {
      ...existing,
      licenses: unique(existing.licenses.concat(component.licenses)),
      cves: unique(existing.cves.concat(component.cves)),
      vulnerabilityCount: Math.max(existing.vulnerabilityCount, component.vulnerabilityCount),
      language: existing.language || component.language,
      securityRisk: existing.securityRisk !== "Unknown" ? existing.securityRisk : component.securityRisk,
      licenseRisk: existing.licenseRisk !== "Unknown" ? existing.licenseRisk : component.licenseRisk,
      obsolescenceRisk:
        existing.obsolescenceRisk !== "Unknown" ? existing.obsolescenceRisk : component.obsolescenceRisk,
    });
  }
  return [...map.values()];
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function emptyAnalysis(): AnalysisModel {
  return {
    files: [],
    findings: [],
    components: [],
    componentCves: [],
    licenses: [],
    obsolescence: [],
    metrics: [],
    application: { name: null, analyzedAt: null },
  };
}
