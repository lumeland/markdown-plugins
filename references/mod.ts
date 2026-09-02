import type { MarkdownIt, Token } from "npm:markdown-it@^15.0.0";

export interface Options {
  /** Site location */
  location: URL;

  /** Key to save the backlinks in the page data */
  key: string;
}

export const defaults: Options = {
  location: new URL("http://localhost:3000"),
  key: "references",
};

export default function references(
  md: MarkdownIt,
  userOptions: Partial<Options> = {},
) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  function getReferences(tokens: Token[], links: Set<string>, pageURL: URL) {
    for (const token of tokens) {
      if (token.type !== "link_open") {
        if (token.children) {
          getReferences(token.children, links, pageURL);
        }
        continue;
      }

      const href = token.attrGet("href");

      if (!href) {
        continue;
      }

      const url = URL.parse(href as string, pageURL);

      // External link
      if (url?.origin !== pageURL.origin) {
        continue;
      }

      // Self link
      if (url.pathname === pageURL.pathname) {
        continue;
      }

      links.add(url.pathname);
    }
  }

  md.core.ruler.push("getReferences", function (state) {
    const data = (state.env.data as
      | { page?: { data?: Record<string, unknown> } }
      | undefined)
      ?.page
      ?.data;

    if (!data) {
      return;
    }

    const link = new Set<string>(data[options.key] as string[] ?? []);
    const pageUrl = pathToUrl(data.url as string, options.location);

    getReferences(state.tokens, link, pageUrl);
    data[options.key] = Array.from(link);
  });
}

function pathToUrl(path: string, location: URL): URL {
  const url = new URL(path, location);

  return url;
}
