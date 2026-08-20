import { emptyAnalysis } from "./parse";
import type { AnalysisModel, ParseWarning } from "./types";

export interface DemoPayload {
  model: AnalysisModel;
  warnings: ParseWarning[];
}

export async function loadDemoAnalysis(): Promise<DemoPayload> {
  const response = await fetch("/analytics-demo.json", { cache: "force-cache" });
  if (!response.ok) {
    return { model: emptyAnalysis(), warnings: [{ file: "demo", message: "No se pudo cargar el análisis de ejemplo." }] };
  }
  const payload = (await response.json()) as unknown;
  if (!isDemoPayload(payload)) {
    return { model: emptyAnalysis(), warnings: [{ file: "demo", message: "El ejemplo tiene un formato inesperado." }] };
  }
  return payload;
}

function isDemoPayload(value: unknown): value is DemoPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    "model" in value &&
    typeof (value as DemoPayload).model === "object" &&
    Array.isArray((value as DemoPayload).model.findings)
  );
}

/** @deprecated use loadDemoAnalysis — kept so verify scripts can import types */
export const DEMO_ANALYSIS: AnalysisModel = emptyAnalysis();
export const DEMO_WARNINGS: ParseWarning[] = [];
