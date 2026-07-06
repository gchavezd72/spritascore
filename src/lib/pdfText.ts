/**
 * jsPDF built-in Helvetica only supports WinAnsi/Latin-1 reliably.
 * Unicode punctuation and accented letters can render as spaced-out glyphs.
 * Normalize all PDF strings through this helper before drawing.
 */
export function pdfText(text: string): string {
  return (
    text
      // Common punctuation → ASCII
      .replace(/\u2192/g, ">")
      .replace(/\u2022/g, "*")
      .replace(/\u00B7/g, "|")
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2026/g, "...")
      // Strip combining accents (Spanish/Portuguese → ASCII)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // Remaining non-WinAnsi chars → closest ASCII or space
      .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "")
  );
}

export function pdfLines(text: string): string[] {
  return pdfText(text).split(/\r?\n/);
}