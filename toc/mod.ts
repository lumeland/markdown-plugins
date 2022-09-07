/**
 * Plugin adapted from https://github.com/nagaozen/markdown-it-toc-done-right
 * Copyright (c) 2018 Fabio Zendhi Nagao
 */

// deno-lint-ignore-file no-explicit-any

import { htmlencode, slugify } from "../utils.ts";

export interface Options {
  /** The pattern serving as the TOC placeholder in your markdown */
  placeholder: string;

  /** Key to save the toc in the page data */
  dataKey?: string;

  /** A custom slugification function */
  slugify: (x: string) => string;

  /** Index to start with when making duplicate slugs unique. */
  uniqueSlugStartIndex: number;

  /** The class for the container DIV */
  containerClass: string;

  /** The ID for the container DIV */
  containerId?: string;

  /** The class for the listType HTMLElement */
  listClass?: string;

  /** The class for the LI */
  itemClass?: string;

  /** The class for the A */
  linkClass?: string;

  /** Minimum level to apply anchors on or array of selected levels */
  level: number;

  /** Type of list (ul for unordered, ol for ordered) */
  listType: "ol" | "ul";

  /** A function for formatting headings */
  format?: (x: string, htmlencode: (x: unknown) => string) => string;

  /** A function (html, ast, env) {} called after rendering. */
  callback?: (
    html: string,
    ast: TocAst,
    env: Record<string, unknown>,
  ) => void;
}

export interface TocAst {
  l: number;
  n: string;
  c: TocAst[];
}

export const defaults: Options = {
  placeholder: "(\\$\\{toc\\}|\\[\\[?_?toc_?\\]?\\]|\\$\\<toc(\\{[^}]*\\})\\>)",
  slugify: slugify,
  uniqueSlugStartIndex: 1,
  containerClass: "table-of-contents",
  containerId: undefined,
  listClass: undefined,
  itemClass: undefined,
  linkClass: undefined,
  level: 1,
  listType: "ol",
  format: undefined,
  callback: undefined,
};

export default function tocPlugin(md: any, userOptions: Partial<Options> = {}) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  let ast: any;
  const pattern = new RegExp("^" + options.placeholder + "$", "i");

  function toc(
    state: any,
    startLine: number,
    _endLine: number,
    silent: boolean,
  ) {
    let token: any;
    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    // use whitespace as a line tokenizer and extract the first token
    // to test against the placeholder anchored pattern, rejecting if false
    const lineFirstToken = state.src.slice(pos, max).split(" ")[0];
    if (!pattern.test(lineFirstToken)) return false;

    if (silent) return true;

    const matches = pattern.exec(lineFirstToken);
    let inlineOptions = {};
    if (matches !== null && matches.length === 3) {
      try {
        inlineOptions = JSON.parse(matches[2]);
      } catch {
        // silently ignore inline options
      }
    }

    state.line = startLine + 1;

    token = state.push("tocOpen", "nav", 1);
    token.markup = "";
    token.map = [startLine, state.line];
    token.inlineOptions = inlineOptions;

    token = state.push("tocBody", "", 0);
    token.markup = "";
    token.map = [startLine, state.line];
    token.inlineOptions = inlineOptions;
    token.children = [];

    token = state.push("tocClose", "nav", -1);
    token.markup = "";

    return true;
  }

  md.renderer.rules.tocOpen = function (tokens: any[], idx: number) {
    let _options = Object.assign({}, options);
    if (tokens && idx >= 0) {
      const token = tokens[idx];
      _options = Object.assign(_options, token.inlineOptions);
    }
    const id = _options.containerId
      ? ` id="${htmlencode(_options.containerId)}"`
      : "";
    return `<nav${id} class="${htmlencode(_options.containerClass)}">`;
  };

  md.renderer.rules.tocClose = function () {
    return "</nav>";
  };

  md.renderer.rules.tocBody = function (tokens: any[], idx: number) {
    let _options = Object.assign({}, options);
    if (tokens && idx >= 0) {
      const token = tokens[idx];
      _options = Object.assign(_options, token.inlineOptions);
    }

    const uniques: Record<string, boolean> = {};
    function unique(s: string) {
      let u = s;
      let i = _options.uniqueSlugStartIndex;
      while (Object.prototype.hasOwnProperty.call(uniques, u)) {
        u = `${s}-${i++}`;
      }
      uniques[u] = true;
      return u;
    }

    const isLevelSelectedNumber = (selection: number) => (level: number) =>
      level >= selection;
    const isLevelSelectedArray = (selection: number[]) => (level: number) =>
      selection.includes(level);

    const isLevelSelected = Array.isArray(_options.level)
      ? isLevelSelectedArray(_options.level)
      : isLevelSelectedNumber(_options.level);

    function ast2html(tree: any) {
      const listClass = _options.listClass
        ? ` class="${htmlencode(_options.listClass)}"`
        : "";
      const itemClass = _options.itemClass
        ? ` class="${htmlencode(_options.itemClass)}"`
        : "";
      const linkClass = _options.linkClass
        ? ` class="${htmlencode(_options.linkClass)}"`
        : "";

      if (tree.c.length === 0) return "";

      let buffer = "";
      if (tree.l === 0 || isLevelSelected(tree.l)) {
        buffer += `<${htmlencode(_options.listType) + listClass}>`;
      }
      tree.c.forEach((node: any) => {
        if (isLevelSelected(node.l)) {
          buffer += `<li${itemClass}><a${linkClass} href="#${
            unique(options.slugify(node.n))
          }">${
            typeof _options.format === "function"
              ? _options.format(node.n, htmlencode)
              : htmlencode(node.n)
          }</a>${ast2html(node)}</li>`;
        } else {
          buffer += ast2html(node);
        }
      });
      if (tree.l === 0 || isLevelSelected(tree.l)) {
        buffer += `</${htmlencode(_options.listType)}>`;
      }
      return buffer;
    }

    return ast2html(ast);
  };

  function headings2ast(tokens: any[]) {
    const ast: TocAst = { l: 0, n: "", c: [] };
    const stack = [ast];

    for (let i = 0, iK = tokens.length; i < iK; i++) {
      const token = tokens[i];
      if (token.type === "heading_open") {
        const key = (
          tokens[i + 1]
            .children!
            .filter(function (token: any) {
              return token.type === "text" || token.type === "code_inline";
            })
            .reduce(function (s: string, t: any) {
              return s + t.content;
            }, "")
        );

        const node = {
          l: parseInt(token.tag.substr(1), 10),
          n: key,
          c: [],
        };

        if (node.l > stack[0].l) {
          stack[0].c.push(node);
          stack.unshift(node);
        } else if (node.l === stack[0].l) {
          stack[1].c.push(node);
          stack[0] = node;
        } else {
          while (node.l <= stack[0].l) stack.shift();
          stack[0].c.push(node);
          stack.unshift(node);
        }
      }
    }

    return ast;
  }

  md.core.ruler.push("generateTocAst", function (state: any) {
    const tokens = state.tokens;
    ast = headings2ast(tokens);

    if (typeof options.callback === "function") {
      options.callback(
        md.renderer.rules.tocOpen() + md.renderer.rules.tocBody() +
          md.renderer.rules.tocClose(),
        ast,
        state.env,
      );
    }
    if (options.dataKey) {
      const data = state.env.data?.page?.data;

      if (data) {
        data[options.dataKey] = md.renderer.rules.tocOpen() +
          md.renderer.rules.tocBody() +
          md.renderer.rules.tocClose();
      }
    }
  });

  md.block.ruler.before("heading", "toc", toc, {
    alt: ["paragraph", "reference", "blockquote"],
  });
}
