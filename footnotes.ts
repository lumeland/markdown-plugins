import footnotes, { Options } from "./footnotes/mod.ts";
import "lume/types.ts";

export default function footnotesPlugin(userOptions: Partial<Options> = {}) {
  return function (site: Lume.Site) {
    site.hooks.addMarkdownItPlugin(footnotes, userOptions);
  };
}
