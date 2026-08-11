import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Locale-less entry → default Spanish, preserve query (Instantly UTMs / sector). */
export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) =>
      typeof v === "string" ? [[k, v]] : Array.isArray(v) ? v.map((x) => [k, x]) : []
    )
  ).toString();
  redirect(qs ? `/es/calculadora/05?${qs}` : "/es/calculadora/05");
}
