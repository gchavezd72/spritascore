import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Spritascore — Application Risk & Cost Calculator",
    template: "%s | Spritascore",
  },
  description:
    "Calcula el costo económico de vulnerabilidades, deuda técnica y riesgos de calidad en software. Basado en ISO/IEC 25010, OWASP Top 10 y criterios por sector.",
  keywords: [
    "calculadora de costo de deuda técnica",
    "calculadora OWASP Top 10",
    "calculadora vulnerabilidades móviles",
    "calculadora riesgo por sector",
    "costo de no calidad en software",
    "application security risk calculator",
  ],
  openGraph: {
    title: "Spritascore — Application Risk & Cost Calculator",
    description: "Convierte riesgos técnicos en impacto financiero en menos de 5 minutos.",
    url: "https://spritascore.com",
    siteName: "Spritascore",
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
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}