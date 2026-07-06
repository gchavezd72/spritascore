const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO ?? "info@spritascore.com";
const LEAD_EMAIL_FROM =
  process.env.LEAD_EMAIL_FROM ?? "SpritaScore <notifications@spritascore.com>";

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

function row(label: string, value: unknown): string {
  const text = asString(value).trim();
  if (!text) return "";
  return `<tr><td style="padding:6px 12px 6px 0;color:#5b6472;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:13px;color:#12213b">${escapeHtml(text)}</td></tr>`;
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
    row("Costo estimado", payload.estimatedCost),
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

export async function sendLeadEmail(payload: unknown): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[Lead email - dev, no RESEND_API_KEY]", payload);
      return true;
    }
    console.error("[Lead email] RESEND_API_KEY is not configured");
    return false;
  }

  const record = asRecord(payload);
  const { subject, html, text, replyTo } = buildLeadEmail(record);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: LEAD_EMAIL_FROM,
        to: [LEAD_EMAIL_TO],
        reply_to: replyTo || undefined,
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[Lead email] Resend error", response.status, detail);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Lead email] Failed to send", error);
    return false;
  }
}