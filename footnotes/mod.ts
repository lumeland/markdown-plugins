// deno-lint-ignore-file no-explicit-any

export interface Options {
  /** Key to save the title in the page data */
  key: string;

  /** The prefix to assign to all ids */
  idPrefix: string;

  /** The prefix to assign to all references ids */
  referenceIdPrefix: string;

  /** HTML attributes to the <sup> element used for the reference */
  referenceAttrs: Record<string, string>;
}

export const defaults: Options = {
  key: "footnotes",
  idPrefix: "fn-",
  referenceIdPrefix: "fnref-",
  referenceAttrs: {
    class: "footnote-ref",
  },
};

export default function footNotes(md: any, userOptions: Partial<Options> = {}) {
  const options = Object.assign({}, defaults, userOptions) as Options;
  const parseLinkLabel = md.helpers.parseLinkLabel;
  const isSpace = md.utils.isSpace;

  md.renderer.rules.footnote_reference = function (tokens: any[], idx: number) {
    const { id, label } = tokens[idx].meta;
    const attrs = Object.entries(options.referenceAttrs)
      .map(([key, value]) => `${key}="${value}"`);

    attrs.push(`href="#${options.idPrefix}${id}"`);
    attrs.push(`id="${options.referenceIdPrefix}${id}"`);

    return `<sup><a ${attrs.join(" ")}>${label}</a></sup>`;
  };

  // Process footnote block definition
  function blocks(
    state: any,
    startLine: number,
    endLine: number,
    silent: boolean,
  ) {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    /* Line should be at least 5 characters: [^x]: */
    if (
      start + 4 > max ||
      state.src.charCodeAt(start) !== 0x5B || /* [ */
      state.src.charCodeAt(start + 1) !== 0x5E /* ^ */
    ) {
      return false;
    }

    let pos;

    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 0x20) {
        return false;
      }
      if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
        break;
      }
    }

    // no empty footnote labels
    if (pos === start + 2) {
      return false;
    }

    if (pos + 1 >= max || state.src.charCodeAt(++pos) !== 0x3A /* : */) {
      return false;
    }

    if (silent) {
      return true;
    }

    pos++;

    const footnotes = getFootnotes(state);
    const label = state.src.slice(start + 2, pos - 2);
    const id = footnotes.size + 1;

    const openToken = new state.Token("footnote_reference_open", "", 1);
    openToken.meta = { id };
    openToken.level = state.level++;
    state.tokens.push(openToken);

    footnotes.set(id, { id, label });

    const oldBMark = state.bMarks[startLine];
    const oldTShift = state.tShift[startLine];
    const oldSCount = state.sCount[startLine];
    const oldParentType = state.parentType;

    const posAfterColon = pos;
    const initial = state.sCount[startLine] + pos -
      (state.bMarks[startLine] + state.tShift[startLine]);
    let offset = initial;

    while (pos < max) {
      const ch = state.src.charCodeAt(pos);

      if (!isSpace(ch)) {
        break;
      }
      if (ch === 0x09) {
        offset += 4 - offset % 4;
      } else {
        offset++;
      }

      pos++;
    }

    state.tShift[startLine] = pos - posAfterColon;
    state.sCount[startLine] = offset - initial;
    state.bMarks[startLine] = posAfterColon;
    state.blkIndent += 4;
    state.parentType = "footnote";

    if (state.sCount[startLine] < state.blkIndent) {
      state.sCount[startLine] += state.blkIndent;
    }

    state.md.block.tokenize(state, startLine, endLine, true);

    state.parentType = oldParentType;
    state.blkIndent -= 4;
    state.tShift[startLine] = oldTShift;
    state.sCount[startLine] = oldSCount;
    state.bMarks[startLine] = oldBMark;

    const closeToken = new state.Token("footnote_reference_close", "", -1);
    closeToken.level = --state.level;
    state.tokens.push(closeToken);

    return true;
  }

  // Process inline footnotes (^[...])
  function inlineFootnotes(state: any, silent: boolean) {
    const max = state.posMax;
    const start = state.pos;

    /* Line should be at least 2 characters: ^[ */
    if (
      start + 2 >= max ||
      state.src.charCodeAt(start) !== 0x5E ||
      state.src.charCodeAt(start + 1) !== 0x5B
    ) {
      return false;
    }

    const labelStart = start + 2;
    const labelEnd = parseLinkLabel(state, start + 1);

    // parser failed to find ']', so it's not a valid note
    if (labelEnd < 0) {
      return false;
    }

    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
      const footnotes = getFootnotes(state);
      const id = footnotes.size + 1;
      const label = id.toString();

      const token = state.push("footnote_reference", "", 0);
      token.meta = { id, label };

      footnotes.set(id, {
        id,
        label,
        content: `<p>${state.src.slice(labelStart, labelEnd)}</p>`,
      });
    }

    state.pos = labelEnd + 1;
    state.posMax = max;
    return true;
  }

  // Process footnote references ([^...])
  function references(state: any, silent: boolean) {
    const max = state.posMax;
    const start = state.pos;

    /* Line should be at least 4 characters: [^x] */
    if (
      start + 3 > max ||
      state.src.charCodeAt(start) !== 0x5B /* [ */ ||
      state.src.charCodeAt(start + 1) !== 0x5E /* ^ */
    ) {
      return false;
    }

    const labelStart = start + 2;
    let labelEnd = 0;

    for (labelEnd = labelStart; labelEnd < max; labelEnd++) {
      const char = state.src.charCodeAt(labelEnd);

      if (char === 0x20 || char === 0x0A) {
        return false;
      }

      if (char === 0x5D /* ] */) {
        break;
      }
    }

    if (labelStart === labelEnd || labelEnd >= max) {
      return false;
    }

    if (!silent) {
      const label = state.src.slice(labelStart, labelEnd);
      const footnote = searchFootnote(state, label);
      const token = state.push("footnote_reference", "", 0);
      token.meta = { ...footnote };
    }

    state.pos = ++labelEnd;
    state.posMax = max;
    return true;
  }

  // Glue footnote tokens to end of token stream
  function footnote_tail(state: any) {
    const footnotes = getFootnotes(state);

    if (!footnotes.size) {
      return;
    }

    let currentFootnote: Footnote | undefined;
    let currentTokens: any[] | undefined;

    state.tokens = state.tokens.filter(function (tok: any) {
      if (tok.type === "footnote_reference_open") {
        currentFootnote = footnotes.get(tok.meta.id)!;
        currentTokens = [];
        return false;
      }

      if (tok.type === "footnote_reference_close") {
        currentFootnote!.content = md.renderer.render(
          currentTokens,
          state.md.options,
        );
        currentTokens = undefined;
        return false;
      }

      if (currentTokens) {
        currentTokens.push(tok);
      }

      return !currentTokens;
    });
  }

  md.block.ruler.before("reference", "footnote_block", blocks, {
    alt: ["paragraph", "reference"],
  });
  md.inline.ruler.after("image", "footnote_inline", inlineFootnotes);
  md.inline.ruler.after("footnote_inline", "footnote_reference", references);
  md.core.ruler.after("inline", "footnote_tail", footnote_tail);

  md.core.ruler.push("saveFootnotes", function (state: any) {
    const data = state.env.data?.page?.data;

    if (!data || data[options.key]) {
      return;
    }

    const footnotes = getFootnotes(state);
    data[options.key] = Array.from(footnotes.values()).map((footnote) => ({
      id: `${options.idPrefix}${footnote.id}`,
      refId: `${options.referenceIdPrefix}${footnote.id}`,
      label: footnote.label,
      content: footnote.content,
    }));
  });
}

interface Footnote {
  id: number;
  label?: string;
  content?: string;
  tokens?: any[];
}

function getFootnotes(state: any): Map<number, Footnote> {
  if (!state.env.fn) {
    state.env.fn = new Map<number, Footnote>();
  }

  return state.env.fn;
}

function searchFootnote(state: any, label: string) {
  const map = getFootnotes(state);

  for (const value of map.values()) {
    if (value.label === label) {
      return value;
    }
  }
}
