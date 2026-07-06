import type { FaqItem } from "@/data/seoContent/types";
import { JsonLd } from "@/components/JsonLd";

interface FaqSectionProps {
  title: string;
  items: FaqItem[];
}

export function FaqSection({ title, items }: FaqSectionProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="seo-faq" id="faq">
      <JsonLd data={schema} />
      <h2 className="seo-h2">{title}</h2>
      <div className="seo-faq-list">
        {items.map((item) => (
          <details key={item.question} className="seo-faq-item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}