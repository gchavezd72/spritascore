import { notFound } from "next/navigation";
import { RegionLocaleSync } from "@/components/RegionLocaleSync";
import { isRegion, REGION_LOCALE, type Region } from "@/lib/regions";

interface RegionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ region: string }>;
}

export default async function RegionLayout({ children, params }: RegionLayoutProps) {
  const { region: regionParam } = await params;
  if (!isRegion(regionParam)) notFound();

  const region = regionParam as Region;
  const locale = REGION_LOCALE[region];

  return (
    <>
      <RegionLocaleSync locale={locale} />
      {children}
    </>
  );
}