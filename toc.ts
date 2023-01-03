import toc, { Options } from "./toc/mod.ts";

export default function tocPlugin(userOptions: Partial<Options> = {}) {
  return function (site: any) {
    site.hooks.addMarkdownItPlugin(toc, userOptions);
  };
}
