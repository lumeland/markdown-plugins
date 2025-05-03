import references, { Options } from "./references/mod.ts";
import "lume/types.ts";

export default function referencesPlugin(
  userOptions: Partial<Omit<Options, "location">> = {},
) {
  return function (site: Lume.Site) {
    const options = {
      ...userOptions,
      location: site.options.location,
    };

    site.hooks.addMarkdownItPlugin(references, options);
  };
}
