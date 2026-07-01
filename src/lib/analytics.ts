export type AnalyticsEvent =
  | "calculator_started"
  | "calculator_completed"
  | "lead_submitted"
  | "report_downloaded"
  | "cta_clicked";

interface EventPayload {
  calculator?: string;
  score?: number;
  riskLevel?: string;
  cost?: number;
  cta?: string;
  [key: string]: unknown;
}

export function trackEvent(event: AnalyticsEvent, payload?: EventPayload) {
  if (typeof window === "undefined") return;

  const data = { event, timestamp: new Date().toISOString(), ...payload };

  window.dispatchEvent(new CustomEvent("spritascore_analytics", { detail: data }));

  if (process.env.NODE_ENV === "development") {
    console.info("[Analytics]", data);
  }

  // Future: GTM, Segment, etc.
  // window.dataLayer?.push({ event, ...payload });
}