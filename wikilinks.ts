import wikilinks, { Options as WikilinksOptions } from "./wikilinks/mod.ts";
import createSlugifier, {
  Options as SlugifierOptions,
} from "lume/core/slugifier.ts";
import { posix } from "lume/deps/path.ts";
import "lume/types.ts";

export interface Options {
  basepath?: string;
  slugify?: Partial<SlugifierOptions> | ((text: string) => string);
  attributes?: Record<string, string>;
  key?: string;
}

export const defaults: Options = {
  key: "wikilinks",
};

export default function wikilinkPlugin(userOptions: Options = {}) {
  const options = { ...defaults, ...userOptions };

  const slugify = typeof options.slugify === "function"
    ? options.slugify
    : createSlugifier(options.slugify);

  return function (site: Lume.Site) {
    const prettyUrls = site.options.prettyUrls;

    const pluginOptions: WikilinksOptions = {
      key: options.key!,
      attributes: options.attributes ?? {},
      url(title: string) {
        const slug = slugify(title);

        if (prettyUrls) {
          return posix.join("/", options.basepath ?? "", slug, "/");
        }

        return posix.join("/", options.basepath ?? "", `${slug}.html`);
      },
    };

    site.hooks.addMarkdownItPlugin(wikilinks, pluginOptions);
  };
}
