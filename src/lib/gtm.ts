/** GA4 recommended event names mapped from SpritaScore custom events. */
const GA4_EVENT_MAP: Record<string, string> = {
  lead_submitted: "generate_lead",
  software_score_form_submit: "generate_lead",
  report_downloaded: "file_download",
  software_score_pdf_download: "file_download",
  cta_clicked: "select_content",
};

export type ConsentState = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureDataLayer() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
}

export function setDefaultConsent() {
  ensureDataLayer();
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
}

export function updateAnalyticsConsent(state: ConsentState) {
  ensureDataLayer();
  window.gtag?.("consent", "update", {
    analytics_storage: state,
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  });
  window.dataLayer?.push({
    event: "consent_update",
    analytics_storage: state,
    ad_storage: state,
  });
}

export function syncConsentFromStorage() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("spritascore_cookie_consent");
  if (stored === "accepted") updateAnalyticsConsent("granted");
  else if (stored === "rejected") updateAnalyticsConsent("denied");
}

export function pushAnalyticsEvent(
  event: string,
  payload: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;

  ensureDataLayer();

  const calculatorId =
    (payload.calculator_id as string | undefined) ||
    (payload.calculator as string | undefined) ||
    (payload.calculatorId as string | undefined);

  const data: Record<string, unknown> = {
    event,
    ga4_event_name: GA4_EVENT_MAP[event] ?? event,
    event_category: "spritascore",
    timestamp: new Date().toISOString(),
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    ...payload,
  };

  if (calculatorId && !data.calculator_id) {
    data.calculator_id = calculatorId;
  }

  if (event === "lead_submitted" || event === "software_score_form_submit") {
    data.lead_source = calculatorId || "spritascore";
    data.conversion = true;
  }

  window.dataLayer?.push(data);
  window.dispatchEvent(new CustomEvent("spritascore_analytics", { detail: data }));

  if (process.env.NODE_ENV === "development") {
    console.info("[Analytics]", data);
  }
}