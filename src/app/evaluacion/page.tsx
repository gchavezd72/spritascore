import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUDIT_ROUTES } from "@/lib/auditRoutes";
import { readLocaleCookie } from "@/lib/localePreference";

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

interface PageProps {
  searchParams: PageSearchParams;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const locale = readLocaleCookie((await cookies()).get("spritascore_locale")?.value);
  const qs = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) =>
      typeof value === "string" ? [[key, value]] : Array.isArray(value) ? value.map((item) => [key, item]) : []
    )
  ).toString();
  redirect(qs ? `${AUDIT_ROUTES[locale]}?${qs}` : AUDIT_ROUTES[locale]);
}
