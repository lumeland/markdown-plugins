import image, { Options } from "./image/mod.ts";

export default function imagePlugin(userOptions: Partial<Options> = {}) {
  // deno-lint-ignore no-explicit-any
  return function (site: any) {
    site.hooks.addMarkdownItPlugin(image, userOptions);
  };
}
