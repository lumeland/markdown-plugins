import footnotes, { Options } from "./footnotes/mod.ts";

export default function footnotesPlugin(userOptions: Partial<Options> = {}) {
  // deno-lint-ignore no-explicit-any
  return function (site: any) {
    site.hooks.addMarkdownItPlugin(footnotes, userOptions);
  };
}
