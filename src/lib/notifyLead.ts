import { forwardToCrmWebhook } from "@/lib/apiSecurity";
import { sendLeadEmail } from "@/lib/sendLeadEmail";
import { syncHubSpotLead, type HubSpotLead } from "@/lib/syncHubSpotLead";

export async function notifyLead<T extends HubSpotLead>(payload: T): Promise<boolean> {
  const hubspotSync = syncHubSpotLead(payload);
  const emailSent = await sendLeadEmail(payload);
  const webhookSent = await forwardToCrmWebhook(payload);
  const hasWebhook = Boolean(process.env.CRM_WEBHOOK_URL);
  await hubspotSync;

  if (!emailSent) return false;
  if (hasWebhook && !webhookSent) return false;
  return true;
}
