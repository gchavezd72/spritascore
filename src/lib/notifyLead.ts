import { forwardToCrmWebhook } from "@/lib/apiSecurity";
import { sendLeadEmail } from "@/lib/sendLeadEmail";

export async function notifyLead(payload: unknown): Promise<boolean> {
  const emailSent = await sendLeadEmail(payload);
  const webhookSent = await forwardToCrmWebhook(payload);
  const hasWebhook = Boolean(process.env.CRM_WEBHOOK_URL);

  if (!emailSent) return false;
  if (hasWebhook && !webhookSent) return false;
  return true;
}