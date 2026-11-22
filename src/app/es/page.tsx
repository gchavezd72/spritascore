import type { Metadata } from "next";
import HomePage from "../page";
import { homeMetadata } from "@/lib/seo";

const metadataBase = homeMetadata("es", "/es");

export const metadata: Metadata = {
  ...metadataBase,
  title: {
    absolute: "SpritaScore — Calculadora de riesgo y costo de software | DevSecOps y ASPM",
  },
};

export default function SpanishHomePage() {
  return <HomePage />;
}
