import title, { Options } from "./title/mod.ts";
import "lume/types.ts";

export default function titlePlugin(userOptions: Partial<Options> = {}) {
  return function (site: Lume.Site) {
    site.hooks.addMarkdownItPlugin(title, userOptions);
  };
}
