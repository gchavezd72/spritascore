/** Lenient RFC 4180 CSV parser. Always comma-separated — Kiuwan exports are rfc_4180. */

export function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const input = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const table: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (char === "\n") {
      row.push(field);
      table.push(row);
      row = [];
      field = "";
      continue;
    }
    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    table.push(row);
  }

  const nonempty = table.filter((cells) => cells.some((cell) => cell.trim().length > 0));
  if (nonempty.length === 0) {
    return { headers: [], rows: [] };
  }

  const rawHeaders = nonempty[0].map((header, index) => normalizeHeader(header, index));
  const headers = uniquifyHeaders(rawHeaders);
  const rows = nonempty.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? "").trim();
    });
    return record;
  });

  return { headers, rows };
}

function normalizeHeader(header: string, index: number): string {
  const cleaned = header.replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : `column_${index + 1}`;
}

function uniquifyHeaders(headers: string[]): string[] {
  const seen = new Map<string, number>();
  return headers.map((header) => {
    const count = seen.get(header) ?? 0;
    seen.set(header, count + 1);
    return count === 0 ? header : `${header} ${count + 1}`;
  });
}

export function cell(row: Record<string, string>, ...aliases: string[]): string {
  for (const alias of aliases) {
    if (row[alias] !== undefined) return row[alias];
    const match = Object.keys(row).find((key) => key.toLowerCase() === alias.toLowerCase());
    if (match) return row[match];
  }
  return "";
}

export function splitList(value: string): string[] {
  if (!value.trim()) return [];
  return value
    .split(/[;|]/)
    .map((part) => part.trim())
    .filter(Boolean);
}
