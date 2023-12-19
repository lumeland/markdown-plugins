import image, { Options } from "./image/mod.ts";
import "lume/types.ts";

export default function imagePlugin(userOptions: Partial<Options> = {}) {
  return function (site: Lume.Site) {
    site.hooks.addMarkdownItPlugin(image, userOptions);
  };
}
