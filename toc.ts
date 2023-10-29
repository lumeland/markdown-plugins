import toc, { defaults, Options as TocOptions } from "./toc/mod.ts";
import createSlugifier, {
  Options as SlugifierOptions,
} from "lume/core/slugifier.ts";
import type { Site } from "lume/core.ts";

export interface Options extends Omit<TocOptions, "slugify"> {
  slugify: Partial<SlugifierOptions> | ((text: string) => string) | undefined;
}

export default function tocPlugin(userOptions: Partial<Options> = {}) {
  const options = { ...defaults, ...userOptions };
  const { slugify } = options;

  if (!slugify || typeof slugify !== "function") {
    options.slugify = createSlugifier(slugify);
  }

  return function (site: Site) {
    site.hooks.addMarkdownItPlugin(toc, options);
  };
}
