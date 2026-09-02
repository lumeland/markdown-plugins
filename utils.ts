import type { Token } from "npm:markdown-it@^15.0.0";

export function getRawText(tokens: Token[]) {
  let text = "";

  for (const token of tokens) {
    switch (token.type) {
      case "text":
      case "code_inline":
        text += token.content;
        break;
      case "softbreak":
      case "hardbreak":
        text += " ";
        break;
    }
  }

  return text;
}

export function slugify(x: string): string {
  return encodeURIComponent(
    String(x).trim().toLowerCase().replace(/\s+/g, "-"),
  );
}
