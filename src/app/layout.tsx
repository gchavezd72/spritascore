import { headers } from "next/headers";
import { Geist, Geist_Mono, Space_Mono } from "next/font/google";
import { BrandBar } from "@/components/BrandBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { LanguageProvider } from "@/components/LanguageProvider";
import { GoogleTagManagerBody, GoogleTagManagerHead } from "@/components/GoogleTagManager";
import { GtmConsentInit } from "@/components/GtmConsentInit";
import { JsonLd } from "@/components/JsonLd";
import { readLocaleCookie } from "@/lib/localePreference";
import {
  faqJsonLd,
  homeMetadata,
  organizationJsonLd,
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

export async function generateMetadata() {
  const locale = readLocaleCookie((await headers()).get("x-sprita-locale"));
  return {
    ...homeMetadata(locale),
    metadataBase: new URL("https://spritascore.com"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = readLocaleCookie((await headers()).get("x-sprita-locale"));

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} h-full antialiased`}>
      <head>
        <GoogleTagManagerHead />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleTagManagerBody />
        <GtmConsentInit />
        <JsonLd
          data={[
            organizationJsonLd(),
            webSiteJsonLd(locale),
            webApplicationJsonLd(locale),
            faqJsonLd(locale),
          ]}
        />
        <LanguageProvider initialLocale={locale}>
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