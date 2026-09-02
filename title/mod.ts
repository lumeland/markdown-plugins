import type { MarkdownIt, Token } from "npm:markdown-it@^15.0.0";
import { getRawText } from "../utils.ts";

export interface Options {
  /** Heading level to look for the title. Use 0 to take whichever heading comes first. */
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Key to save the title in the page data */
  key: string;

  /** Function to transform the title before saving it */
  transform?: (
    title: string | undefined,
    data: Record<string, unknown>,
  ) => string;
}

export const defaults: Options = {
  level: 1,
  key: "title",
};

export default function title(
  md: MarkdownIt,
  userOptions: Partial<Options> = {},
) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  function getTitle(tokens: Token[]): string | undefined {
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type !== "heading_open") {
        continue;
      }

      // Calculate the level
      const level = parseInt(token.tag.substring(1), 10);

      if (options.level === 0 || level === options.level) {
        return getRawText(tokens[i + 1].children!);
      }
    }
  }

  md.core.ruler.push("getTitle", function (state) {
    const data = (state.env.data as
      | { page?: { data?: Record<string, unknown> } }
      | undefined)
      ?.page
      ?.data;

    if (!data || data[options.key]) {
      return;
    }

    const title = options.transform
      ? options.transform(getTitle(state.tokens), data)
      : getTitle(state.tokens);

    data[options.key] = title;
  });
}
