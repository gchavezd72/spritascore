import type { Metadata } from "next";
import HomePage from "../page";
import { homeMetadata } from "@/lib/seo";

const metadataBase = homeMetadata("pt", "/pt");

export const metadata: Metadata = {
  ...metadataBase,
  title: {
    absolute: "SpritaScore — Calculadora de risco e custo de software | DevSecOps e ASPM",
  },
};

export default function PortugueseHomePage() {
  return <HomePage />;
}
