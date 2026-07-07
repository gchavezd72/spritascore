import { Geist, Geist_Mono, Space_Mono } from "next/font/google";
import { BrandBar } from "@/components/BrandBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { LanguageProvider } from "@/components/LanguageProvider";
import { GoogleTagManagerBody, GoogleTagManagerHead } from "@/components/GoogleTagManager";
import { GtmConsentInit } from "@/components/GtmConsentInit";
import { JsonLd } from "@/components/JsonLd";
import {
  faqJsonLd,
  organizationJsonLd,
  rootMetadata,
  webApplicationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";
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

export const metadata = {
  ...rootMetadata,
  title: {
    default: "SpritaScore — Calculadora de riesgo y costo de software | DevSecOps y ASPM",
    template: "%s | SpritaScore",
  },
  metadataBase: new URL("https://spritascore.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} h-full antialiased`}>
      <head>
        <GoogleTagManagerHead />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleTagManagerBody />
        <GtmConsentInit />
        <JsonLd
          data={[organizationJsonLd(), webSiteJsonLd(), webApplicationJsonLd(), faqJsonLd()]}
        />
        <LanguageProvider>
          <BrandBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}