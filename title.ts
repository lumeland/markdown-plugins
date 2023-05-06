import title, { Options } from "./title/mod.ts";

export default function titlePlugin(userOptions: Partial<Options> = {}) {
  // deno-lint-ignore no-explicit-any
  return function (site: any) {
    site.hooks.addMarkdownItPlugin(title, userOptions);
  };
}
