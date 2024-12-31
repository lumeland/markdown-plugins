import wikilinks, { Options as WikilinksOptions } from "./wikilinks/mod.ts";
import createSlugifier from "lume/core/slugifier.ts";
import { posix } from "lume/deps/path.ts";
import "lume/types.ts";

export interface Options {
  /** URL base path for all wikilinks pages  */
  basePath?: string;

  /** Custom URL generation function */
  url?: (title: string) => string;

  /** Custom attributes for the wikilinks */
  attributes?: Record<string, string>;
}

export default function wikilinkPlugin(options: Options = {}) {
  const { basePath, url, attributes } = options;

  return function (site: Lume.Site) {
    const prettyUrls = site.options.prettyUrls;
    const store = new Map<string, string>();

    const slugify = createSlugifier();
    function defaultUrl(title: string) {
      const slug = slugify(title);

      if (prettyUrls) {
        return posix.join("/", basePath ?? "", slug, "/");
      }

      return posix.join("/", basePath ?? "", `${slug}.html`);
    }

    const pluginOptions: WikilinksOptions = {
      wikilinks: store,
      attributes: attributes ?? {},
      url: url
        ? (title: string) => posix.join("/", basePath ?? "", url(title))
        : defaultUrl,
    };

    const links = new Wikilinks(site, store);

    site.hooks.addMarkdownItPlugin(wikilinks, pluginOptions);
    site.data("wikilinks", links);
    site.addEventListener("beforeUpdate", () => links.clearCache());
  };
}

class Wikilinks {
  site: Lume.Site;
  store: Map<string, string>;
  #cache: Wikilink[] | undefined;

  constructor(site: Lume.Site, store: Map<string, string>) {
    this.site = site;
    this.store = store;
  }

  clearCache() {
    this.#cache = undefined;
  }

  all(): Wikilink[] {
    if (!this.#cache) {
      const cache: Wikilink[] = [];

      for (const [url, title] of this.store) {
        const exists = this.site.pages.some((p) => p.data.url === url);
        cache.push({ url, title, exists });
      }

      this.#cache = cache;
    }

    return this.#cache;
  }

  missing(): Wikilink[] {
    return this.all().filter((link) => !link.exists);
  }

  existing(): Wikilink[] {
    return this.all().filter((link) => link.exists);
  }
}

interface Wikilink {
  title: string;
  url: string;
  exists: boolean;
}

declare global {
  namespace Lume {
    export interface Data {
      /**
       * Wikilinks
       */
      wikilinks: Wikilinks;
    }
  }
}
