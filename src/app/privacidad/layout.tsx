import { headers } from "next/headers";
import { readLocaleCookie } from "@/lib/localePreference";
import { privacyMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = readLocaleCookie((await headers()).get("x-sprita-locale"));
  return privacyMetadata(locale);
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}