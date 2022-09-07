const position = {
  false: "push",
  true: "unshift",
  after: "push",
  before: "unshift",
};

const permalinkSymbolMeta = {
  isPermalinkSymbol: true,
};

export function renderHref(slug) {
  return `#${slug}`;
}

export function renderAttrs(_slug) {
  return {};
}

const commonDefaults = {
  class: "header-anchor",
  symbol: "#",
  renderHref,
  renderAttrs,
};

export function makePermalink(renderPermalinkImpl) {
  function renderPermalink(opts) {
    opts = Object.assign({}, renderPermalink.defaults, opts);

    return (slug, anchorOpts, state, idx) => {
      return renderPermalinkImpl(slug, opts, anchorOpts, state, idx);
    };
  }

  renderPermalink.defaults = Object.assign({}, commonDefaults);
  renderPermalink.renderPermalinkImpl = renderPermalinkImpl;

  return renderPermalink;
}

export const linkInsideHeader = makePermalink(
  (slug, opts, _anchorOpts, state, idx) => {
    const linkTokens = [
      Object.assign(new state.Token("link_open", "a", 1), {
        attrs: [
          ...(opts.class ? [["class", opts.class]] : []),
          ["href", opts.renderHref(slug, state)],
          ...(opts.ariaHidden ? [["aria-hidden", "true"]] : []),
          ...Object.entries(opts.renderAttrs(slug, state)),
        ],
      }),
      Object.assign(new state.Token("html_inline", "", 0), {
        content: opts.symbol,
        meta: permalinkSymbolMeta,
      }),
      new state.Token("link_close", "a", -1),
    ];

    if (opts.space) {
      const space = typeof opts.space === "string" ? opts.space : " ";
      const type = typeof opts.space === "string" ? "html_inline" : "text";
      state.tokens[idx + 1].children[position[opts.placement]](
        Object.assign(new state.Token(type, "", 0), { content: space }),
      );
    }

    state.tokens[idx + 1].children[position[opts.placement]](...linkTokens);
  },
);

Object.assign(linkInsideHeader.defaults, {
  space: true,
  placement: "after",
  ariaHidden: false,
});

export const ariaHidden = makePermalink(linkInsideHeader.renderPermalinkImpl);

ariaHidden.defaults = Object.assign({}, linkInsideHeader.defaults, {
  ariaHidden: true,
});

export const headerLink = makePermalink(
  (slug, opts, _anchorOpts, state, idx) => {
    const linkTokens = [
      Object.assign(new state.Token("link_open", "a", 1), {
        attrs: [
          ...(opts.class ? [["class", opts.class]] : []),
          ["href", opts.renderHref(slug, state)],
          ...Object.entries(opts.renderAttrs(slug, state)),
        ],
      }),
      ...(opts.safariReaderFix
        ? [new state.Token("span_open", "span", 1)]
        : []),
      ...state.tokens[idx + 1].children,
      ...(opts.safariReaderFix
        ? [new state.Token("span_close", "span", -1)]
        : []),
      new state.Token("link_close", "a", -1),
    ];

    state.tokens[idx + 1] = Object.assign(new state.Token("inline", "", 0), {
      children: linkTokens,
    });
  },
);

Object.assign(headerLink.defaults, {
  safariReaderFix: false,
});

export const linkAfterHeader = makePermalink(
  (slug, opts, _anchorOpts, state, idx) => {
    if (
      !["visually-hidden", "aria-label", "aria-describedby", "aria-labelledby"]
        .includes(opts.style)
    ) {
      throw new Error(
        `\`permalink.linkAfterHeader\` called with unknown style option \`${opts.style}\``,
      );
    }

    if (
      !["aria-describedby", "aria-labelledby"].includes(opts.style) &&
      !opts.assistiveText
    ) {
      throw new Error(
        `\`permalink.linkAfterHeader\` called without the \`assistiveText\` option in \`${opts.style}\` style`,
      );
    }

    if (opts.style === "visually-hidden" && !opts.visuallyHiddenClass) {
      throw new Error(
        "`permalink.linkAfterHeader` called without the `visuallyHiddenClass` option in `visually-hidden` style",
      );
    }

    const title = state.tokens[idx + 1]
      .children
      .filter((token) => token.type === "text" || token.type === "code_inline")
      .reduce((acc, t) => acc + t.content, "");

    const subLinkTokens = [];
    const linkAttrs = [];

    if (opts.class) {
      linkAttrs.push(["class", opts.class]);
    }

    linkAttrs.push(["href", opts.renderHref(slug, state)]);
    linkAttrs.push(...Object.entries(opts.renderAttrs(slug, state)));

    if (opts.style === "visually-hidden") {
      subLinkTokens.push(
        Object.assign(new state.Token("span_open", "span", 1), {
          attrs: [["class", opts.visuallyHiddenClass]],
        }),
        Object.assign(new state.Token("text", "", 0), {
          content: opts.assistiveText(title),
        }),
        new state.Token("span_close", "span", -1),
      );

      if (opts.space) {
        const space = typeof opts.space === "string" ? opts.space : " ";
        const type = typeof opts.space === "string" ? "html_inline" : "text";
        subLinkTokens[position[opts.placement]](
          Object.assign(new state.Token(type, "", 0), { content: space }),
        );
      }

      subLinkTokens[position[opts.placement]](
        Object.assign(new state.Token("span_open", "span", 1), {
          attrs: [["aria-hidden", "true"]],
        }),
        Object.assign(new state.Token("html_inline", "", 0), {
          content: opts.symbol,
          meta: permalinkSymbolMeta,
        }),
        new state.Token("span_close", "span", -1),
      );
    } else {
      subLinkTokens.push(
        Object.assign(new state.Token("html_inline", "", 0), {
          content: opts.symbol,
          meta: permalinkSymbolMeta,
        }),
      );
    }

    if (opts.style === "aria-label") {
      linkAttrs.push(["aria-label", opts.assistiveText(title)]);
    } else if (["aria-describedby", "aria-labelledby"].includes(opts.style)) {
      linkAttrs.push([opts.style, slug]);
    }

    const linkTokens = [
      Object.assign(new state.Token("link_open", "a", 1), {
        attrs: linkAttrs,
      }),
      ...subLinkTokens,
      new state.Token("link_close", "a", -1),
    ];

    state.tokens.splice(idx + 3, 0, ...linkTokens);

    if (opts.wrapper) {
      state.tokens.splice(
        idx,
        0,
        Object.assign(new state.Token("html_block", "", 0), {
          content: opts.wrapper[0] + "\n",
        }),
      );

      state.tokens.splice(
        idx + 3 + linkTokens.length + 1,
        0,
        Object.assign(new state.Token("html_block", "", 0), {
          content: opts.wrapper[1] + "\n",
        }),
      );
    }
  },
);

Object.assign(linkAfterHeader.defaults, {
  style: "visually-hidden",
  space: true,
  placement: "after",
  wrapper: null,
});
