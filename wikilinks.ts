import wikilinks, { defaults } from "./wikilinks/mod.ts";
import createSlugifier, {
  Options as SlugifierOptions,
} from "lume/core/slugifier.ts";

import "lume/types.ts";

export interface Options {
  slugify: Partial<SlugifierOptions> | ((text: string) => string) | undefined;
}

export default function wikilinkPlugin(userOptions: Partial<Options> = {}) {
  const options = { ...defaults, ...userOptions };
  const { slugify } = options;

  if (!slugify || typeof slugify !== "function") {
    options.slugify = createSlugifier(slugify);
  }

  return function (site: Lume.Site) {
    site.hooks.addMarkdownItPlugin(wikilinks, options);
  };
}
