// deno-lint-ignore-file no-explicit-any
export interface Options {
  /** Key to save the image in the page data */
  key: string;
  attribute: string;
}

export const defaults: Options = {
  key: "image",
  attribute: "main",
};

export default function image(md: any, userOptions: Partial<Options> = {}) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  function getImage(tokens: any[], img: PageImage): PageImage {
    for (const token of tokens) {
      if (token.type === "image") {
        let src = "";
        let main = false;
        for (const [name, value] of token.attrs) {
          if (name === "src") {
            src = value;
          }
          if (name === options.attribute) {
            main = true;
          }
        }
        // Remove main attribute
        const index = token.attrIndex(options.attribute);

        if (index !== -1) {
          token.attrs.splice(index, 1);
        }

        if (src) {
          if (!img.first) {
            img.first = src;
          }
          if (main) {
            img.main = src;
            return img;
          }
        }
        continue;
      }

      if (token.children) {
        img = getImage(token.children, img);

        if (img.main) {
          return img;
        }
      }
    }

    return img;
  }

  md.core.ruler.push("getImage", function (state: any) {
    const data = state.env.data?.page?.data;

    if (!data || data[options.key]) {
      return;
    }

    const img = getImage(state.tokens, {});
    data[options.key] = img.main || img.first;
  });
}

interface PageImage {
  first?: string;
  main?: string;
}
