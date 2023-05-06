import toc, { Options } from "./toc/mod.ts";

export default function tocPlugin(userOptions: Partial<Options> = {}) {
  // deno-lint-ignore no-explicit-any
  return function (site: any) {
    site.hooks.addMarkdownItPlugin(toc, userOptions);
  };
}
