/** Default function to slugify */
export function slugify(x: unknown): string {
  return encodeURIComponent(
    String(x).trim().toLowerCase().replace(/\s+/g, "-"),
  );
}

/** Encode HTML chars */
export function htmlencode(x: unknown): string {
  return String(x)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
