// deno-lint-ignore-file no-explicit-any
import { slugify } from "../utils.ts";

const START_CHAR = 0x5B /* [ */;
const END_CHAR = 0x5D /* ] */;

function parseLink(
  state: any,
  silent: boolean,
  options: Options,
) {
  const max = state.posMax;
  const start = state.pos;

  if (state.src.charCodeAt(start) !== START_CHAR) return false;
  if (state.src.charCodeAt(start + 1) !== START_CHAR) return false;
  if (silent) return false;
  if (start + 4 >= max) return false;
  state.pos = start + 2;
  let found = false;

  while (state.pos < max) {
    if (
      state.src.charCodeAt(state.pos) === END_CHAR &&
      state.src.charCodeAt(state.pos + 1) === END_CHAR
    ) {
      found = true;
      break;
    }

    state.md.inline.skipToken(state);
  }

  if (!found || start + 2 === state.pos) {
    state.pos = start;
    return false;
  }

  // found!
  const content = state.src.slice(start + 2, state.pos);

  state.posMax = state.pos;
  state.pos = start + 1;

  // Open the link
  const token_o = state.push("link_open", "a", 1);
  token_o.markup = "wikilink";
  token_o.info = "auto";
  token_o.attrs = [["data-wikilink", options.slugify(content)]];

  // Create the text content
  const token_t = state.push("text", "", 0);
  token_t.content = state.md.normalizeLinkText(content);

  // Close the link
  const token_c = state.push("link_close", "a", -1);
  token_c.markup = "wikilink";
  token_c.info = "auto";

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
}

export interface Options {
  /** Slugify function */
  slugify: (x: string) => string;
}

export const defaults: Options = {
  slugify,
};

export default function wikilink(md: any, userOptions: Partial<Options> = {}) {
  const options = Object.assign({}, defaults, userOptions) as Options;

  md.inline.ruler.after(
    "emphasis",
    "wikilinks",
    (state: any, silent: boolean) => parseLink(state, silent, options),
  );
}
