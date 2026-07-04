import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SpritaScore — Seguridad de aplicaciones, DevSecOps y ASPM | Calculadora de riesgo y costo",
    template: "%s | SpritaScore",
  },
  description:
    "Convierte el riesgo técnico en impacto financiero. Seguridad de aplicaciones para equipos DevSecOps: ASPM, análisis de código con IA, gestión de vulnerabilidades y SBOM. Calcula en minutos el costo de una vulnerabilidad o de la mala calidad del código.",
  keywords: [
    "seguridad de aplicaciones",
    "DevSecOps",
    "ASPM",
    "análisis de código IA",
    "gestión de vulnerabilidades",
    "SBOM",
    "OWASP Top 10",
    "EU Cyber Resilience Act",
    "deuda técnica",
    "ISO 25010",
  ],
  openGraph: {
    title: "SpritaScore — Seguridad de aplicaciones, DevSecOps y ASPM",
    description: "Convierte el riesgo técnico en impacto financiero: ASPM, análisis de código con IA, gestión de vulnerabilidades y SBOM.",
    url: "https://spritascore.com",
    siteName: "SpritaScore",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}