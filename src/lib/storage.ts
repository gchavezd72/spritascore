import type { CalculationResult, LeadData } from "@/types/calculator";

const RESULTS_KEY = "spritascore_results";
const LEADS_KEY = "spritascore_leads";

export function saveResult(result: CalculationResult): void {
  if (typeof window === "undefined") return;
  const existing = getAllResults();
  existing[result.id] = result;
  localStorage.setItem(RESULTS_KEY, JSON.stringify(existing));
}

export function getResult(id: string): CalculationResult | null {
  if (typeof window === "undefined") return null;
  const all = getAllResults();
  return all[id] ?? null;
}

export function getAllResults(): Record<string, CalculationResult> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLead(resultId: string, lead: LeadData): void {
  if (typeof window === "undefined") return;
  const existing = getAllLeads();
  existing[resultId] = { ...lead, submittedAt: new Date().toISOString() };
  localStorage.setItem(LEADS_KEY, JSON.stringify(existing));
}

export function getLead(resultId: string): (LeadData & { submittedAt?: string }) | null {
  if (typeof window === "undefined") return null;
  const all = getAllLeads();
  return all[resultId] ?? null;
}

function getAllLeads(): Record<string, LeadData & { submittedAt?: string }> {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}