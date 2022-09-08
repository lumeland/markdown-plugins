// deno-lint-ignore-file no-explicit-any
function getRawText(tokens: any[]) {
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

export interface Options {
  /** Heading level to look for the title. Use 0 to take whichever heading comes first. */
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Key to save the toc in the page data */
  key: string;
}

export const defaults: Options = {
  level: 1,
  key: "title",
};

export default function title(md: any, userOptions: Partial<Options> = {}) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  const originalHeadingOpen = md.renderer.rules.heading_open;

  md.renderer.rules.heading_open = function (
    tokens: any[],
    idx: number,
    opts: any,
    env: Record<string, any>,
    self: any,
  ) {
    const data = env.data?.page?.data;

    if (
      data && !data[options.key] &&
      (options.level === 0 || tokens[idx].tag === `h${options.level}`)
    ) {
      data[options.key] = getRawText(tokens[idx + 1].children);
    }

    if (originalHeadingOpen) {
      return originalHeadingOpen(tokens, idx, opts, env, self);
    }

    return self.renderToken(tokens, idx, opts, env, self);
  };
}
