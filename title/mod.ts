// deno-lint-ignore-file no-explicit-any
import { getRawText } from "../utils.ts";

export interface Options {
  /** Heading level to look for the title. Use 0 to take whichever heading comes first. */
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Key to save the title in the page data */
  key: string;
}

export const defaults: Options = {
  level: 1,
  key: "title",
};

export default function title(md: any, userOptions: Partial<Options> = {}) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  function getTitle(tokens: any[]): string | undefined {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type !== "heading_open") {
        continue;
      }

      // Calculate the level
      const level = parseInt(token.tag.substr(1), 10);

      if (options.level === 0 || level === options.level) {
        return getRawText(tokens[i + 1].children);
      }
    }
  }

  md.core.ruler.push("getTitle", function (state: any) {
    const data = state.env.data?.page?.data;

    if (!data || data[options.key]) {
      return;
    }

    data[options.key] = getTitle(state.tokens);
  });
}
