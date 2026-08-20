import type { Priority } from "./types";

const BUILD_PATH =
  /(^|\/)(build|intermediates|generated|node_modules|\.gradle|dist|out|coverage|\.next)(\/|$)/i;

export function isBuildArtifact(filePath: string): boolean {
  return BUILD_PATH.test(filePath.replace(/\\/g, "/"));
}

export function parsePriority(raw: string): Priority {
  const value = raw.trim().toLowerCase();
  if (value === "very high" || value === "very-high" || value === "critical" || value === "blocker") {
    return "very-high";
  }
  if (value === "high" || value === "error" || value === "major") return "high";
  if (value === "normal" || value === "medium" || value === "moderate" || value === "warning") {
    return "medium";
  }
  if (value === "low" || value === "minor" || value === "note") return "low";
  if (value === "very low" || value === "very-low" || value === "info") return "very-low";
  return "unknown";
}

export function sarifLevelToPriority(level: string | undefined): Priority {
  const value = (level ?? "").toLowerCase();
  if (value === "error") return "high";
  if (value === "warning") return "medium";
  if (value === "note" || value === "none") return "low";
  return "unknown";
}

export function parseEffortMinutes(raw: string): number {
  const value = raw.trim().toLowerCase();
  if (!value) return 0;
  const hours = value.match(/(\d+(?:\.\d+)?)\s*h/);
  const minutes = value.match(/(\d+(?:\.\d+)?)\s*m/);
  const hoursValue = hours ? Number.parseFloat(hours[1]) : 0;
  const minutesValue = minutes ? Number.parseFloat(minutes[1]) : 0;
  if (!hours && !minutes) {
    const numeric = Number.parseFloat(value);
    return Number.isFinite(numeric) ? Math.round(numeric) : 0;
  }
  return Math.round(hoursValue * 60 + minutesValue);
}

export function parseNumber(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  const cleaned = raw.trim().replace(",", ".");
  if (!cleaned) return null;
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : null;
}

export function parseCount(raw: string | number | null | undefined): number {
  return parseNumber(raw) ?? 0;
}

export function parseCwes(raw: string): string[] {
  if (!raw.trim()) return [];
  const matches = raw.match(/CWE-?\d+|\b\d{1,4}\b/gi) ?? [];
  const unique = new Set<string>();
  for (const match of matches) {
    const digits = match.replace(/\D/g, "");
    if (digits) unique.add(`CWE-${digits}`);
  }
  return [...unique];
}

export function parseNormative(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseBoolean(raw: string): boolean {
  const value = raw.trim().toLowerCase();
  return value === "yes" || value === "true" || value === "1" || value === "y";
}

export function priorityRank(priority: Priority): number {
  switch (priority) {
    case "very-high":
      return 5;
    case "high":
      return 4;
    case "medium":
      return 3;
    case "low":
      return 2;
    case "very-low":
      return 1;
    default:
      return 0;
  }
}

export function priorityLabel(priority: Priority): string {
  switch (priority) {
    case "very-high":
      return "Muy alta";
    case "high":
      return "Alta";
    case "medium":
      return "Media";
    case "low":
      return "Baja";
    case "very-low":
      return "Muy baja";
    default:
      return "Sin priorizar";
  }
}

export function formatEffort(minutes: number): string {
  if (minutes <= 0) return "—";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export function characteristicKey(raw: string): string {
  const value = raw.trim();
  if (!value) return "Sin clasificar";
  return value;
}

export function riskRank(raw: string): number {
  const value = raw.trim().toLowerCase();
  if (value === "critical" || value === "very high" || value === "very-high") return 5;
  if (value === "high") return 4;
  if (value === "medium" || value === "moderate" || value === "normal") return 3;
  if (value === "low") return 2;
  if (value === "none" || value === "n/a" || value === "no") return 0;
  if (value === "unknown" || value === "") return 1;
  return 1;
}

export function extractApplicationName(files: string[]): string | null {
  for (const file of files) {
    const android = file.match(/\/kotlin\/([a-z0-9_.]+)\/MainActivity/i);
    if (android) {
      const parts = android[1].split(".");
      return parts[parts.length - 2] ?? parts[parts.length - 1] ?? null;
    }
  }
  return null;
}

export function extractAnalysisTimestamp(filename: string): string | null {
  const match = filename.match(/(\d{4}-\d{2}-\d{2})[ T_-](\d{2})[-:](\d{2})[-:](\d{2})/);
  if (!match) {
    const dateOnly = filename.match(/(\d{4}-\d{2}-\d{2})/);
    return dateOnly ? dateOnly[1] : null;
  }
  return `${match[1]} ${match[2]}:${match[3]}:${match[4]}`;
}

export function isIdentifiableComponent(name: string): boolean {
  const value = name.trim();
  if (!value) return false;
  if (/^[a-f0-9]{32,}(_\d+)?$/i.test(value)) return false;
  return true;
}

export function slugId(parts: Array<string | number | null | undefined>): string {
  return parts
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join("|")
    .slice(0, 240);
}
