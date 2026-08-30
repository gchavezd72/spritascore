/** Local timestamp with seconds and tenths of a second: YYYY-MM-DD_HH-MM-SS.T */
export function uniqueStamp(now = new Date()): string {
  const pad = (value: number, width = 2) => String(value).padStart(width, "0");
  const tenths = Math.floor(now.getMilliseconds() / 100);
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.${tenths}`;
}

function sanitizePrefix(prefix: string): string {
  return (
    prefix
      .trim()
      .replace(/[^\w.\-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "spritascore"
  );
}

/** Browser print dialog title (Chrome appends .pdf). */
export function calculatorPdfBasename(prefix: string, now = new Date()): string {
  return `${sanitizePrefix(prefix)}-${uniqueStamp(now)}`;
}

export function calculatorPdfFilename(prefix: string, now = new Date()): string {
  return `${calculatorPdfBasename(prefix, now)}.pdf`;
}
