// deno-lint-ignore no-explicit-any
export function getRawText(tokens: any[]) {
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
