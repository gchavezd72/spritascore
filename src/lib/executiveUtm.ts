export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

const STORAGE_KEY = "spritascore_executive_utm";

export function captureUtmFromSearch(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const utm: UtmParams = {};

  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ] as const) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  return utm;
}

export function persistUtm(utm: UtmParams) {
  if (typeof window === "undefined") return;
  const hasValues = Object.values(utm).some(Boolean);
  if (!hasValues) return;
  try {
    const existing = getPersistedUtm();
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...existing, ...utm, referrer: document.referrer || existing.referrer })
    );
  } catch {
    /* ignore */
  }
}

export function getPersistedUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
  "yopmail.com",
  "throwaway.email",
  "getnada.com",
  "sharklasers.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}