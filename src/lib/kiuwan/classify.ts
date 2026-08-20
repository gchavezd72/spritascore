import type { KiuwanFileKind } from "./types";

const NAME_RULES: Array<{ kind: KiuwanFileKind; test: RegExp }> = [
  { kind: "sarif", test: /\.sarif(\.json)?$/i },
  { kind: "sbom", test: /sbom|cyclonedx/i },
  { kind: "insight-security", test: /insight[_\s-]*security/i },
  { kind: "insight-components", test: /insight[_\s-]*components/i },
  { kind: "insight-license", test: /insight[_\s-]*license/i },
  { kind: "insight-obsolescence", test: /insight[_\s-]*obsolescence/i },
  { kind: "vulnerabilities", test: /vulnerabilit/i },
  { kind: "defects", test: /defect/i },
  { kind: "metrics", test: /metrics/i },
];

const HEADER_SIGNATURES: Array<{ kind: KiuwanFileKind; headers: string[] }> = [
  { kind: "insight-security", headers: ["cve", "cvss base score", "exploitability subscore"] },
  { kind: "insight-components", headers: ["#vulnerabilities", "obsolescence risk", "security risk"] },
  { kind: "insight-license", headers: ["spdx code", "permissions", "limitations"] },
  { kind: "insight-obsolescence", headers: ["used version", "last version", "time inactivity"] },
  { kind: "metrics", headers: ["global indicator", "maintainability indicator", "efficiency indicator"] },
  { kind: "vulnerabilities", headers: ["vulnerability type", "rule code", "priority"] },
  { kind: "defects", headers: ["software characteristic", "rule code", "priority"] },
];

export function classifyByFilename(filename: string): KiuwanFileKind {
  const base = filename.split(/[/\\]/).pop() ?? filename;
  for (const rule of NAME_RULES) {
    if (rule.test.test(base)) return rule.kind;
  }
  if (base.toLowerCase().endsWith(".json") && /sarif/i.test(base)) return "sarif";
  return "unknown";
}

export function classifyByHeaders(headers: string[]): KiuwanFileKind {
  const normalized = headers.map((header) => header.toLowerCase().replace(/\s+/g, " ").trim());
  let best: { kind: KiuwanFileKind; score: number } | null = null;
  for (const signature of HEADER_SIGNATURES) {
    const score = signature.headers.filter((token) =>
      normalized.some((header) => header.includes(token))
    ).length;
    if (score === 0) continue;
    if (!best || score > best.score) best = { kind: signature.kind, score };
  }
  return best && best.score >= 2 ? best.kind : "unknown";
}

export function classifyJson(value: unknown, filename: string): KiuwanFileKind {
  if (isRecord(value)) {
    if (value.bomFormat === "CycloneDX" || Array.isArray(value.components) && value.specVersion) {
      return "sbom";
    }
    if (value.$schema && String(value.$schema).includes("sarif") || Array.isArray(value.runs)) {
      return "sarif";
    }
  }
  return classifyByFilename(filename);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function allowedUpload(filename: string): boolean {
  const lower = filename.toLowerCase();
  return (
    lower.endsWith(".csv") ||
    lower.endsWith(".json") ||
    lower.endsWith(".sarif") ||
    lower.endsWith(".sarif.json")
  );
}
