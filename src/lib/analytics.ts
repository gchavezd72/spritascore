export type AnalyticsEvent =
  | "calculator_started"
  | "calculator_completed"
  | "lead_submitted"
  | "report_downloaded"
  | "cta_clicked";

export type ExecutiveAnalyticsEvent =
  | "software_score_view"
  | "software_score_start"
  | "software_score_question_answered"
  | "software_score_completed"
  | "software_score_pdf_download"
  | "software_score_assessment_click"
  | "software_score_form_submit";

interface EventPayload {
  calculator?: string;
  score?: number;
  riskLevel?: string;
  cost?: number;
  cta?: string;
  [key: string]: unknown;
}

export function trackEvent(
  event: AnalyticsEvent | ExecutiveAnalyticsEvent,
  payload?: EventPayload
) {
  if (typeof window === "undefined") return;

  const data = { event, timestamp: new Date().toISOString(), ...payload };

  window.dispatchEvent(new CustomEvent("spritascore_analytics", { detail: data }));

  if (process.env.NODE_ENV === "development") {
    console.info("[Analytics]", data);
  }

  // Future: GTM, Segment, etc.
  // window.dataLayer?.push({ event, ...payload });
}

export function trackExecutiveEvent(
  event: ExecutiveAnalyticsEvent,
  payload?: EventPayload
) {
  trackEvent(event, payload);
}