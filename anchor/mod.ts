// deno-lint-ignore-file no-explicit-any
import * as permalink from "./permalink.js";
import { slugify } from "../utils.ts";

export interface Options {
  /** Minimum level to apply anchors, or array of selected levels. */
  level: number | number[];

  /** A custom slugification function. */
  slugify(str: string): string;

  /** A custom function to get the text contents of the title from its tokens. */
  getTokensText(tokens: any[]): string;

  /** Index to start with when making duplicate slugs unique. */
  uniqueSlugStartIndex: number;

  /** A function to render permalinks */
  permalink: (slug: string, opts: any, state: any, index: number) => void;

  /** Called with token and info after rendering. */
  callback?(token: any, anchor_info: any): void;

  /** Value of the tabindex attribute on headings, set to false to disable. */
  tabIndex: number | false;
}

const defaults: Options = {
  level: 1,
  slugify,
  uniqueSlugStartIndex: 1,
  tabIndex: -1,
  getTokensText,
  permalink: permalink.headerLink(),
};

export default function anchor(md: any, userOptions: Partial<Options> = {}) {
  const opts: Options = Object.assign({}, defaults, userOptions);

  md.core.ruler.push("anchor", (state: any) => {
    const slugs = {};
    const tokens = state.tokens;

    const isLevelSelected = Array.isArray(opts.level)
      ? isLevelSelectedArray(opts.level)
      : isLevelSelectedNumber(opts.level!);

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx];

      if (token.type !== "heading_open") {
        continue;
      }

      if (!isLevelSelected(Number(token.tag.substr(1)))) {
        continue;
      }

      // Aggregate the next token children text.
      const title = opts.getTokensText(tokens[idx + 1].children);

      let slug = token.attrGet("id");

      if (slug == null) {
        slug = uniqueSlug(
          opts.slugify(title),
          slugs,
          false,
          opts.uniqueSlugStartIndex,
        );
      } else {
        slug = uniqueSlug(slug, slugs, true, opts.uniqueSlugStartIndex);
      }

      token.attrSet("id", slug);

      if (opts.tabIndex !== false) {
        token.attrSet("tabindex", `${opts.tabIndex}`);
      }
      console.log(opts.permalink);
      opts.permalink(slug, opts, state, idx);

      // A permalink renderer could modify the `tokens` array so
      // make sure to get the up-to-date index on each iteration.
      idx = tokens.indexOf(token);

      if (opts.callback) {
        opts.callback(token, { slug, title });
      }
    }
  });
}

function getTokensText(tokens: any[]): string {
  return tokens
    .filter((t) => ["text", "code_inline"].includes(t.type))
    .map((t) => t.content)
    .join("");
}

function uniqueSlug(
  slug: string,
  slugs: Record<string, boolean>,
  failOnNonUnique: boolean,
  startIndex: number,
): string {
  let uniq = slug;
  let i = startIndex;

  if (failOnNonUnique && Object.prototype.hasOwnProperty.call(slugs, uniq)) {
    throw new Error(
      `User defined \`id\` attribute \`${slug}\` is not unique. Please fix it in your Markdown to continue.`,
    );
  } else {
    while (Object.prototype.hasOwnProperty.call(slugs, uniq)) {
      uniq = `${slug}-${i}`;
      i += 1;
    }
  }

  slugs[uniq] = true;

  return uniq;
}

const isLevelSelectedNumber = (selection: number) => (level: number) =>
  level >= selection;
const isLevelSelectedArray = (selection: number[]) => (level: number) =>
  selection.includes(level);
