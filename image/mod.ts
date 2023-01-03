// deno-lint-ignore-file no-explicit-any
export interface Options {
  /** Key to save the image in the page data */
  key: string;
}

export const defaults: Options = {
  key: "image",
};

export default function image(md: any, userOptions: Partial<Options> = {}) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  function getImage(tokens: any[]): string | undefined {
    for (const token of tokens) {
      if (token.type === "image") {
        for (const [name, value] of token.attrs) {
          if (name === "src") {
            return value;
          }
        }
        continue;
      }

      if (token.children) {
        const image = getImage(token.children);

        if (image) {
          return image;
        }
      }
    }
  }

  md.core.ruler.push("getImage", function (state: any) {
    const data = state.env.data?.page?.data;

    if (!data || data[options.key]) {
      return;
    }

    data[options.key] = getImage(state.tokens);
  });
}
