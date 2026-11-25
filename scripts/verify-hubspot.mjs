import assert from "node:assert/strict";

const { notifyLead } = await import("../src/lib/notifyLead.ts");
const { syncHubSpotLead } = await import("../src/lib/syncHubSpotLead.ts");

const CRM = "https://api.hubapi.com/crm/objects/2026-09";
const payload = {
  event: "audit_scope_request",
  lead: { name: "CRM Test", email: "CRM-TEST+AUDIT@example.com", company: "Example", role: "CTO" },
  timestamp: "2026-11-25T12:00:00.000Z",
  language: "es",
  calculatorId: "owasp-web",
  auditId: "AUD-02",
  executiveSummary: "Private assessment details",
};

// Every request is stubbed, including the email provider.
let calls = [];
function mockResponses(...responses) {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, method: init.method, body: init.body && JSON.parse(init.body), headers: init.headers });
    const next = responses.shift();
    if (!next) throw new Error("Unexpected request");
    if (next instanceof Error) throw next;
    return Response.json(next[1] ?? {}, { status: next[0] });
  };
}

delete process.env.HUBSPOT_SERVICE_KEY;
mockResponses();
await syncHubSpotLead(payload);
assert.equal(calls.length, 0);

process.env.HUBSPOT_SERVICE_KEY = "test-service-key";
mockResponses([201, { id: "123" }], [201]);
await syncHubSpotLead(payload);
assert.equal(calls.length, 2);
assert.equal(calls[0].url, `${CRM}/contacts`);
assert.equal(calls[0].headers.Authorization, "Bearer test-service-key");
assert.deepEqual(calls[0].body.properties, {
  email: "crm-test+audit@example.com", firstname: "CRM Test", company: "Example", jobtitle: "CTO",
});
assert.equal(calls[1].url, `${CRM}/notes`);
assert.equal(calls[1].body.associations[0].to.id, "123");
assert.equal(calls[1].body.associations[0].types[0].associationTypeId, 202);
assert.match(calls[1].body.properties.hs_note_body, /Audit scope request.*Language: es.*Calculator: owasp-web.*AUD-02/);
assert.doesNotMatch(JSON.stringify(calls[1].body), /Private assessment details|example\.com/);

mockResponses([409], [200, { id: "456" }], [201]);
await syncHubSpotLead({ ...payload, event: "euaiact_form_submit", language: "pt", auditId: undefined });
assert.deepEqual(calls.map((call) => call.method), ["POST", "GET", "POST"]);
assert.equal(calls[1].url, `${CRM}/contacts/crm-test%2Baudit%40example.com?idProperty=email&properties=email`);
assert.equal(calls[2].body.associations[0].to.id, "456");
assert.match(calls[2].body.properties.hs_note_body, /EU AI Act assessment.*Language: pt/);

process.env.RESEND_API_KEY = "test-resend-key";
delete process.env.CRM_WEBHOOK_URL;
mockResponses([429], [200]);
const warnings = [];
const savedWarn = console.warn;
console.warn = (...args) => warnings.push(args.join(" "));
try {
  assert.equal(await notifyLead(payload), true, "Email remains the fallback when HubSpot fails");
  assert.equal(calls[1].url, "https://api.resend.com/emails");
  assert.deepEqual(warnings, ["[HubSpot] Failed to create contact (429)"]);
} finally {
  console.warn = savedWarn;
}

console.log("HubSpot verification: passed (disabled, new contact, existing contact, email fallback)");
