const HUBSPOT_CRM = "https://api.hubapi.com/crm/objects/2026-09";
const HUBSPOT_TIMEOUT_MS = 5_000;
const NOTE_TO_CONTACT = 202;

const FORM_LABELS = {
  audit_scope_request: "Audit scope request",
  lead_submitted: "Report request",
  software_score_form_submit: "Executive software risk assessment",
  euaiact_form_submit: "EU AI Act assessment",
} as const;

export type HubSpotLead = {
  event: keyof typeof FORM_LABELS;
  lead: { name: string; email: string; company: string; role?: string };
  timestamp: string;
  language?: "es" | "en" | "pt";
  calculatorId?: string;
  auditId?: string;
};

export async function syncHubSpotLead(payload: HubSpotLead): Promise<void> {
  const key = process.env.HUBSPOT_SERVICE_KEY?.trim();
  if (!key) return;

  const { lead, event, language, calculatorId, auditId, timestamp } = payload;
  const email = lead.email.trim().toLowerCase();
  const signal = AbortSignal.timeout(HUBSPOT_TIMEOUT_MS);
  let operation = "create contact";

  const request = (path: string, body?: object) => fetch(`${HUBSPOT_CRM}/${path}`, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "error",
    cache: "no-store",
    signal,
  });

  try {
    let contact = await request("contacts", {
      properties: {
        email,
        firstname: lead.name,
        company: lead.company,
        ...(lead.role && (event === "lead_submitted" || event === "audit_scope_request")
          ? { jobtitle: lead.role }
          : {}),
      },
    });

    if (contact.status === 409) {
      operation = "find existing contact";
      contact = await request(`contacts/${encodeURIComponent(email)}?idProperty=email&properties=email`);
    }
    if (!contact.ok) {
      console.warn(`[HubSpot] Failed to ${operation} (${contact.status})`);
      return;
    }

    const { id } = (await contact.json()) as { id?: string };
    if (typeof id !== "string" || !/^\d+$/.test(id)) {
      console.warn("[HubSpot] Invalid contact response");
      return;
    }

    operation = "create activity note";
    const note = await request("notes", {
      properties: {
        hs_timestamp: timestamp,
        hs_note_body: [
          `SpritaScore — ${FORM_LABELS[event]}`,
          language && `Language: ${language}`,
          calculatorId && /^[a-z0-9-]+$/.test(calculatorId) && `Calculator: ${calculatorId}`,
          auditId && /^AUD-0[1-7]$/.test(auditId) && `Audit: ${auditId}`,
        ].filter(Boolean).join("<br>"),
      },
      associations: [{
        to: { id },
        types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: NOTE_TO_CONTACT }],
      }],
    });
    if (!note.ok) console.warn(`[HubSpot] Failed to ${operation} (${note.status})`);
  } catch {
    console.warn(`[HubSpot] Failed to ${operation}`);
  }
}
