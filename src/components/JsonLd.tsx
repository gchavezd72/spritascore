interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** JSON stays valid. Characters that can close a script tag are escaped. */
export function jsonLdHtml(item: Record<string, unknown>): string {
  return JSON.stringify(item)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(item) }}
        />
      ))}
    </>
  );
}