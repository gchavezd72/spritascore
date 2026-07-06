import type { GuideSlug } from "@/lib/seoRoutes";
import type { Locale } from "@/types/calculator";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoCalculatorContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  shortAnswer: string;
  measures: string[];
  inputs: string[];
  howItWorks: string[];
  example: string;
  scoreMeaning: string[];
  limitations: string[];
  faq: FaqItem[];
  methodologySlug: string;
  relatedGuideSlugs: GuideSlug[];
}

export interface SeoGuideContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  sections: { heading: string; paragraphs: string[] }[];
  faq: FaqItem[];
  references: { label: string; url: string }[];
}

export interface SeoMethodologyContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  overview: string[];
  factors: string[];
  outputs: string[];
  limitations: string[];
  faq: FaqItem[];
}

export interface RegionalHomeContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  valueProps: { title: string; body: string }[];
  faq: FaqItem[];
}

export type ContentLocale = Locale;