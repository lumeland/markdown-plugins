// deno-lint-ignore-file no-explicit-any
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
  md: any,
  userOptions: Partial<Options> = {},
) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  function getReferences(tokens: any[], links: Set<string>, pageURL: URL) {
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

      const url = URL.parse(href, pageURL);

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

  md.core.ruler.push("getReferences", function (state: any) {
    const data = state.env.data?.page?.data;

    if (!data) {
      return;
    }

    const link = new Set<string>(data[options.key] ?? []);
    const pageUrl = pathToUrl(data.url, options.location);

    getReferences(state.tokens, link, pageUrl);
    data[options.key] = Array.from(link);
  });
}

function pathToUrl(path: string, location: URL): URL {
  const url = new URL(path, location);

  return url;
}
