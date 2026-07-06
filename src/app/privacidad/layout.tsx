import { privacyMetadata } from "@/lib/seo";

export const metadata = privacyMetadata();

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}