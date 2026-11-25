/**
 * GTM import helper — run: npm run gtm:import-guide
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const importFile = path.join(root, "scripts/gtm-spritascore-import.json");

const ga4Id = process.argv[2];

if (ga4Id && /^G-[A-Z0-9]+$/i.test(ga4Id)) {
  const json = JSON.parse(fs.readFileSync(importFile, "utf8"));
  const variable = json.containerVersion.variable.find((v) => v.name === "GA4 - Measurement ID");
  if (variable) {
    variable.parameter[0].value = ga4Id;
    fs.writeFileSync(importFile, JSON.stringify(json, null, 2));
    console.log(`Updated GA4 Measurement ID to ${ga4Id} in import file.`);
  }
}

console.log(`
SpritaScore GTM setup (container GTM-NDXVZKB3)
=============================================

The site already loads GTM. Review the existing workspace before import.

1. Open https://tagmanager.google.com → container GTM-NDXVZKB3
2. Admin → Import container
3. Choose file:
   ${importFile}
4. Workspace: Default Workspace
5. Import option: Merge → Overwrite conflicting tags, triggers, and variables
6. Edit variable "GA4 - Measurement ID" → your G-XXXXXXXXXX
7. Preview the workspace and confirm that each successful lead submission
   fires exactly one generate_lead tag before publishing the GTM changes.

If import fails with "formato no válido", re-download the latest file from the repo
(scripts/gtm-spritascore-import.json) — it must include fingerprint and tagManagerUrl fields.

Before import, set your GA4 Measurement ID (G-XXXXXXXXXX):
   npm run gtm:import-guide -- G-XXXXXXXXXX

Or edit variable "GA4 - Measurement ID" in GTM after import.

Included tags:
- GA4 - Configuration (Initialization - All Pages)
- GA4 - Events calculator_started and calculator_completed
- GA4 - Event generate_lead for successful report, assessment and audit requests

In GA4, create event-scoped custom dimensions for calculator_id, locale and
lead_type. Mark generate_lead as a key event if it is not already configured.

Test in GTM Preview on an approved test deployment and check GA4 DebugView.
Use a test lead and confirm that the expected inbox receives it.
`);
