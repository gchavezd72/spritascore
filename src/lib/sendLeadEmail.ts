const DEFAULT_LEAD_TO = "info@sprita-it.com";
const DEFAULT_FROM = "SpritaScore <info@sprita-it.com>";
const FALLBACK_FROM = "SpritaScore <notifications@spritascore.com>";
const SPRITA_IT_INBOX = "info@sprita-it.com";

export type OutgoingEmail = {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
};

type LocaleCode = "es" | "en" | "pt";

const RISK_LABEL: Record<LocaleCode, Record<string, string>> = {
  es: { bajo: "Bajo", moderado: "Moderado", alto: "Alto", critico: "Crítico", low: "Bajo", moderate: "Moderado", high: "Alto", critical: "Crítico" },
  en: { bajo: "Low", moderado: "Moderate", alto: "High", critico: "Critical", low: "Low", moderate: "Moderate", high: "High", critical: "Critical" },
  pt: { bajo: "Baixo", moderado: "Moderado", alto: "Alto", critico: "Crítico", low: "Baixo", moderate: "Moderado", high: "Alto", critical: "Crítico" },
};

const CLIENT_COPY: Record<
  LocaleCode,
  {
    subject: (title: string) => string;
    kicker: string;
    hello: (name: string) => string;
    intro: (title: string) => string;
    score: string;
    risk: string;
    cost: string;
    summary: string;
    recs: string;
    next: string;
    footer: string;
  }
> = {
  es: {
    subject: (title) => `Su resultado SpritaScore — ${title}`,
    kicker: "Resultado de su calculadora",
    hello: (name) => `Hola ${name},`,
    intro: (title) => `Este es el resultado de <strong>${title}</strong> que completó en spritascore.com.`,
    score: "Score de riesgo",
    risk: "Nivel de riesgo",
    cost: "Estimación económica",
    summary: "Resumen ejecutivo",
    recs: "Recomendaciones priorizadas",
    next: "Esto es una estimación. Para validar la exposición real, responda este correo o escriba a info@sprita-it.com.",
    footer: "SpritaScore es una marca de Sprita iT. Los resultados son orientativos y no sustituyen un diagnóstico técnico.",
  },
  en: {
    subject: (title) => `Your SpritaScore result — ${title}`,
    kicker: "Your calculator result",
    hello: (name) => `Hi ${name},`,
    intro: (title) => `Here is the result of <strong>${title}</strong> that you completed on spritascore.com.`,
    score: "Risk score",
    risk: "Risk level",
    cost: "Financial estimate",
    summary: "Executive summary",
    recs: "Prioritized recommendations",
    next: "This is an estimate. To validate actual exposure, reply to this email or write to info@sprita-it.com.",
    footer: "SpritaScore is a Sprita iT brand. Results are indicative and do not replace a technical assessment.",
  },
  pt: {
    subject: (title) => `Seu resultado SpritaScore — ${title}`,
    kicker: "Resultado da sua calculadora",
    hello: (name) => `Olá ${name},`,
    intro: (title) => `Este é o resultado de <strong>${title}</strong> que você concluiu em spritascore.com.`,
    score: "Score de risco",
    risk: "Nível de risco",
    cost: "Estimativa econômica",
    summary: "Resumo executivo",
    recs: "Recomendações priorizadas",
    next: "Isto é uma estimativa. Para validar a exposição real, responda este e-mail ou escreva para info@sprita-it.com.",
    footer: "SpritaScore é uma marca da Sprita iT. Os resultados são indicativos e não substituem um diagnóstico técnico.",
  },
};

export function resolveLeadRecipients(raw = process.env.LEAD_EMAIL_TO): string[] {
  const value = raw && raw.trim() ? raw : DEFAULT_LEAD_TO;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resolveFromAddress(raw = process.env.LEAD_EMAIL_FROM): string {
  return raw && raw.trim() ? raw.trim() : DEFAULT_FROM;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function asLocale(value: unknown): LocaleCode {
  return value === "en" || value === "pt" ? value : "es";
}

function row(label: string, value: unknown): string {
  const text = asString(value).trim();
  if (!text) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#5b6472;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:13px;color:#12213b">${escapeHtml(text)}</td></tr>`;
}

function wantsClientReport(payload: Record<string, unknown>): boolean {
  return asRecord(payload.lead).wantsEmailReport === true;
}

function buildLeadEmail(payload: Record<string, unknown>) {
  const lead = asRecord(payload.lead);
  const event = asString(payload.event);
  const isExecutive = event === "software_score_form_submit";

  const subject = isExecutive
    ? `[SpritaScore] Executive Risk Score — ${asString(lead.company) || "Nuevo lead"}`
    : `[SpritaScore] Nuevo lead — ${asString(lead.company) || "Calculadora"}`;

  const rows = [
    row("Nombre", lead.name),
    row("Empresa", lead.company),
    row("Email", lead.email),
    row("Cargo", lead.role),
    row("País", lead.country),
    row("Sector", lead.sector),
    row("Nº aplicaciones", lead.appCount),
    row("Quiere reporte por email", lead.wantsEmailReport ? "Sí" : "No"),
    row("Calculadora", payload.calculatorTitle ?? payload.calculatorId),
    row("ID resultado", payload.resultId),
    row("Score", payload.score),
    row("Nivel de riesgo", payload.riskLevel),
    row("Costo estimado", payload.estimatedCostFormatted ?? payload.estimatedCost),
    row("Impacto formateado", payload.impactFormatted),
    row("SpritaScore (0-1000)", payload.spritaScore),
    row("Clasificación", payload.classification),
    row("Madurez", payload.maturityPercent != null ? `${payload.maturityPercent}%` : ""),
    row("Puntos madurez", payload.rawMaturityPoints),
    row("Etiqueta nivel", payload.levelLabel),
    row("Idioma", payload.language),
    row("UTM source", payload.utm_source),
    row("UTM medium", payload.utm_medium),
    row("UTM campaign", payload.utm_campaign),
    row("UTM content", payload.utm_content),
    row("UTM term", payload.utm_term),
    row("Referrer", payload.referrer),
    row("Fecha", payload.timestamp),
  ]
    .filter(Boolean)
    .join("");

  const recommendations = Array.isArray(payload.topRecommendations)
    ? payload.topRecommendations.map((item) => `<li>${escapeHtml(asString(item))}</li>`).join("")
    : "";

  const weakCategories = Array.isArray(payload.topWeakCategories)
    ? payload.topWeakCategories.map((item) => `<li>${escapeHtml(asString(item))}</li>`).join("")
    : "";

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;color:#12213b">
      <div style="background:#12213b;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
        <div style="font-size:20px;font-weight:700">Sprita<span style="color:#1fbf6c">Score</span></div>
        <div style="font-size:13px;opacity:0.85;margin-top:4px">Nuevo lead desde spritascore.com</div>
      </div>
      <div style="border:1px solid #e6e9ef;border-top:none;padding:24px;border-radius:0 0 8px 8px">
        <p style="margin:0 0 16px;font-size:14px;line-height:1.5">
          ${isExecutive ? "Solicitud de Software Risk Assessment ejecutivo." : "Lead capturado desde una calculadora."}
        </p>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        ${recommendations ? `<h3 style="font-size:14px;margin:20px 0 8px">Recomendaciones destacadas</h3><ul style="margin:0;padding-left:18px;font-size:13px">${recommendations}</ul>` : ""}
        ${weakCategories ? `<h3 style="font-size:14px;margin:20px 0 8px">Brechas principales</h3><ul style="margin:0;padding-left:18px;font-size:13px">${weakCategories}</ul>` : ""}
        <p style="margin:24px 0 0;font-size:12px;color:#5b6472">Responder a este correo contacta directamente al prospecto.</p>
      </div>
    </div>
  `;

  const text = [
    isExecutive ? "Executive Risk Score lead" : "Calculator lead",
    "",
    `Nombre: ${asString(lead.name)}`,
    `Empresa: ${asString(lead.company)}`,
    `Email: ${asString(lead.email)}`,
    `Cargo: ${asString(lead.role)}`,
    `Calculadora: ${asString(payload.calculatorTitle ?? payload.calculatorId)}`,
    `Score: ${asString(payload.score)}`,
    `Riesgo: ${asString(payload.riskLevel)}`,
  ].join("\n");

  return {
    subject,
    html,
    text,
    replyTo: asString(lead.email),
  };
}

function metricCell(label: string, value: string): string {
  if (!value) return "";
  return `<td style="padding:12px 14px;border:1px solid #e6e9ef;background:#f7f8fa;width:33%">
    <div style="font-size:11px;color:#5b6472;text-transform:uppercase;letter-spacing:0.04em">${escapeHtml(label)}</div>
    <div style="font-size:18px;font-weight:700;color:#12213b;margin-top:4px">${escapeHtml(value)}</div>
  </td>`;
}

function buildClientResultEmail(payload: Record<string, unknown>): OutgoingEmail | null {
  const lead = asRecord(payload.lead);
  const email = asString(lead.email).trim();
  if (!email) return null;

  const locale = asLocale(payload.language);
  const copy = CLIENT_COPY[locale];
  const title = asString(payload.calculatorTitle || payload.calculatorId || "SpritaScore");
  const name = asString(lead.name) || (locale === "en" ? "there" : locale === "pt" ? "olá" : "hola");
  const score = asString(payload.score).trim();
  const riskKey = asString(payload.riskLevel).trim();
  const risk = asString(payload.levelLabel).trim() || RISK_LABEL[locale][riskKey] || riskKey;
  const cost = asString(payload.estimatedCostFormatted || payload.estimatedCost).trim();
  const summary = asString(payload.executiveSummary).trim();
  const recs = Array.isArray(payload.topRecommendations)
    ? payload.topRecommendations.map((item) => asString(item).trim()).filter(Boolean)
    : [];

  const cells = [
    metricCell(copy.score, score),
    metricCell(copy.risk, risk),
    metricCell(copy.cost, cost),
  ].filter(Boolean);

  const recHtml = recs.length
    ? `<h3 style="font-size:14px;margin:24px 0 8px">${copy.recs}</h3><ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.5">${recs.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";

  const summaryHtml = summary
    ? `<h3 style="font-size:14px;margin:24px 0 8px">${copy.summary}</h3><p style="margin:0;font-size:14px;line-height:1.6">${escapeHtml(summary)}</p>`
    : "";

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;color:#12213b">
      <div style="background:#12213b;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
        <div style="font-size:20px;font-weight:700">Sprita<span style="color:#1fbf6c">Score</span></div>
        <div style="font-size:13px;opacity:0.85;margin-top:4px">${copy.kicker}</div>
      </div>
      <div style="border:1px solid #e6e9ef;border-top:none;padding:24px;border-radius:0 0 8px 8px">
        <p style="margin:0 0 8px;font-size:15px">${escapeHtml(copy.hello(name))}</p>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6">${copy.intro(escapeHtml(title))}</p>
        ${cells.length ? `<table style="width:100%;border-collapse:collapse;margin:0 0 8px"><tr>${cells.join("")}</tr></table>` : ""}
        ${summaryHtml}
        ${recHtml}
        <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#12213b">${copy.next}</p>
        <p style="margin:16px 0 0;font-size:12px;color:#5b6472">${copy.footer}</p>
      </div>
    </div>
  `;

  const text = [
    copy.hello(name),
    "",
    asString(payload.calculatorTitle || payload.calculatorId),
    score ? `${copy.score}: ${score}` : "",
    risk ? `${copy.risk}: ${risk}` : "",
    cost ? `${copy.cost}: ${cost}` : "",
    summary ? `${copy.summary}: ${summary}` : "",
    recs.length ? `${copy.recs}: ${recs.join("; ")}` : "",
    "",
    copy.next,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    from: resolveFromAddress(),
    to: [email],
    replyTo: SPRITA_IT_INBOX,
    subject: copy.subject(title),
    html,
    text,
  };
}

export function buildOutgoingEmails(payload: unknown): OutgoingEmail[] {
  const record = asRecord(payload);
  const internal = buildLeadEmail(record);
  const messages: OutgoingEmail[] = [
    {
      from: resolveFromAddress(),
      to: resolveLeadRecipients(),
      replyTo: internal.replyTo || undefined,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
    },
  ];

  if (wantsClientReport(record)) {
    const client = buildClientResultEmail(record);
    if (client) messages.push(client);
  }

  return messages;
}

function isUnverifiedFrom(detail: string): boolean {
  const lower = detail.toLowerCase();
  return (
    lower.includes("not verified") ||
    lower.includes("domain is not verified") ||
    lower.includes("invalid `from`") ||
    lower.includes("from domain")
  );
}

async function postResendOnce(
  apiKey: string,
  message: OutgoingEmail,
  from: string
): Promise<{ ok: boolean; status: number; detail: string }> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: message.to,
      reply_to: message.replyTo || undefined,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const detail = response.ok ? "" : await response.text().catch(() => "");
  return { ok: response.ok, status: response.status, detail };
}

async function postResend(apiKey: string, message: OutgoingEmail): Promise<boolean> {
  const preferred = await postResendOnce(apiKey, message, message.from);
  if (preferred.ok) return true;

  const canFallback =
    isUnverifiedFrom(preferred.detail) &&
    !message.from.includes("spritascore.com") &&
    FALLBACK_FROM !== message.from;

  if (canFallback) {
    console.warn("[Lead email] preferred from not verified, retrying with", FALLBACK_FROM);
    const fallback = await postResendOnce(apiKey, message, FALLBACK_FROM);
    if (fallback.ok) return true;
    console.error("[Lead email] Resend error", fallback.status, fallback.detail);
    return false;
  }

  console.error("[Lead email] Resend error", preferred.status, preferred.detail);
  return false;
}

export async function sendLeadEmail(payload: unknown): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const messages = buildOutgoingEmails(payload);

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[Lead email - dev, no RESEND_API_KEY]", messages.map((item) => item.to));
      return true;
    }
    console.error("[Lead email] RESEND_API_KEY is not configured");
    return false;
  }

  if (messages.some((item) => item.to.length === 0)) {
    console.error("[Lead email] Missing recipients");
    return false;
  }

  try {
    const results = await Promise.all(messages.map((message) => postResend(apiKey, message)));
    return results.every(Boolean);
  } catch (error) {
    console.error("[Lead email] Failed to send", error);
    return false;
  }
}
