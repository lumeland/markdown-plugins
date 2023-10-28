/**
 * Plugin adapted from https://github.com/nagaozen/markdown-it-toc-done-right
 * Copyright (c) 2018 Fabio Zendhi Nagao
 */

// deno-lint-ignore-file no-explicit-any
import { headerLink } from "./anchors.ts";
import { getRawText } from "../utils.ts";

export interface Options {
  /** Minimum level to apply anchors. */
  level: number;

  /** Key to save the toc in the page data */
  key: string;

  /** Anchor type */
  anchor: false | ((slug: string, state: any, idx: number) => void);

  /** Slugify function */
  slugify: (x: string) => string;

  /** Value of the tabindex attribute on headings, set to false to disable. */
  tabIndex: number | false;
}

export const defaults: Options = {
  level: 2,
  key: "toc",
  anchor: headerLink(),
  slugify,
  tabIndex: -1,
};

export interface Node {
  level: number;
  text: string;
  slug: string;
  url: string;
  children: Node[];
}

export default function toc(md: any, userOptions: Partial<Options> = {}) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  function headings2ast(state: any, pageUrl?: string): Node[] {
    const tokens: any[] = state.tokens;
    const ast: Node = { level: 0, text: "", slug: "", url: "", children: [] };
    const stack = [ast];
    const slugs = new Set<string>();

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type !== "heading_open") {
        continue;
      }

      // Calculate the level
      const level = parseInt(token.tag.substr(1), 10);

      if (level < options.level) {
        continue;
      }

      // Get the text
      const text = getRawText(tokens[i + 1].children);

      // Get the slug
      let slug = token.attrGet("id") || options.slugify(text);

      // Make sure the slug is unique
      while (slugs.has(slug)) {
        slug += "-1";
      }
      slugs.add(slug);

      token.attrSet("id", slug);

      if (options.tabIndex !== false) {
        token.attrSet("tabindex", `${options.tabIndex}`);
      }

      if (options.anchor) {
        options.anchor(slug, state, i);
      }

      // A permalink renderer could modify the `tokens` array so
      // make sure to get the up-to-date index on each iteration.
      i = tokens.indexOf(token);

      // Create the node
      const url = pageUrl ? `${pageUrl}#${slug}` : `#${slug}`;

      // Save the node in the tree
      const node: Node = { level, text, slug, url, children: [] };

      if (node.level > stack[0].level) {
        stack[0].children.push(node);
        stack.unshift(node);
        continue;
      }

      if (node.level === stack[0].level) {
        stack[1].children.push(node);
        stack[0] = node;
        continue;
      }

      while (node.level <= stack[0].level) {
        stack.shift();
      }
      stack[0].children.push(node);
      stack.unshift(node);
    }

    return ast.children;
  }

  md.core.ruler.push("generateTocAst", function (state: any) {
    const data = state.env.data?.page?.data;

    if (!data) {
      return;
    }

    data[options.key] = headings2ast(state, data.url);
  });
}

function slugify(x: string): string {
  return encodeURIComponent(
    String(x).trim().toLowerCase().replace(/\s+/g, "-"),
  );
}
