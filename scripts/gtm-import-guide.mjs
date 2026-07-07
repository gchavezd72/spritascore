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

The site already loads GTM. The container is currently EMPTY (no tags).
Import the prepared configuration:

1. Open https://tagmanager.google.com → container GTM-NDXVZKB3
2. Admin → Import container
3. Choose file:
   ${importFile}
4. Workspace: Default Workspace
5. Import option: Merge → Overwrite conflicting tags
6. Submit → Publish

Before import, set your GA4 Measurement ID (G-XXXXXXXXXX):
   npm run gtm:import-guide -- G-XXXXXXXXXX

Or edit variable "GA4 - Measurement ID" in GTM after import.

Included tags:
- GA4 - Configuration (Initialization - All Pages, consent required)
- GA4 - Event (dynamic) on SpritaScore dataLayer events
- GA4 - Conversion generate_lead on lead forms

Test: GTM Preview → https://spritascore.com → accept cookies → submit a lead
`);