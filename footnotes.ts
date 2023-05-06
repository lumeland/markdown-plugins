import footnotes, { Options } from "./footnotes/mod.ts";

export default function footnotesPlugin(userOptions: Partial<Options> = {}) {
  return function (site: any) {
    site.hooks.addMarkdownItPlugin(footnotes, userOptions);
  };
}
