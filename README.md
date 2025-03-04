# Lume Markdown Plugins

Collection of markdown-it plugins adapted to Lume

## Title

This plugin extracts the document title and saves it in the `title` key of the
page data. Useful if you want to use plain markdown files, without front matter.

[See the demo](title/demo/)

## Image

This plugin extracts the document image and saves it in the `image` key of the
page data. Useful if you want to use the first image as a cover or open graph
image.

[See the demo](image/demo/)

## TOC

This plugin generates a table of contents (TOC) and saves it in the `toc` key of
the page data, so you can insert it in your layouts. It also generates the
anchors of the headers.

[See the demo](toc/demo/)

There are two ways to generate the anchors: `linkInsideHeader` and `headerLink`
(used by default). To change to `linkInsideHeader`:

```ts
import toc, { linkInsideHeader } from "lume_markdown_plugins/toc.ts";

const site = lume()
  .use(toc({
    anchor: linkInsideHeader(),
  }));

export default site;
```

## Footnotes

Plugin to collect all footnotes and save them in the `footnotes` key of the page
data, allowing to insert them in the layouts.

## Wikilinks

Plugin to parse all wikilinks of in the markdown files and convert to links.

```ts
import wikilinks from "lume_markdown_plugins/wikilinks.ts";

const site = lume();
site.use(wikilinks());

// Search and replace the wikilinks with the final URLs
site.process([".html"], (pages) => {
  for (const page of pages) {
    // Search all wikilinks in the page
    for (const link of page.document!.querySelectorAll("a[data-wikilink]")) {
      // Get the link id and remove the attribute
      const id = link.getAttribute("data-wikilink");
      link.removeAttribute("data-wikilink");

      // Search a page with this id
      const found = pages.find((p) => p.data.id === id);

      if (found) {
        link.setAttribute("href", found.data.url);
      } else {
        link.setAttribute("title", "This page does not exist");
      }
    }
  }
});

export default site;
```

## Usage

```ts
import toc from "lume_markdown_plugins/toc.ts";
import title from "lume_markdown_plugins/title.ts";
import image from "lume_markdown_plugins/image.ts";
import footnotes from "lume_markdown_plugins/footnotes.ts";
import wikilinks from "lume_markdown_plugins/wikilinks.ts";

const site = lume()
  .use(toc())
  .use(title())
  .use(image())
  .use(footnotes())
  .use(wikilinks());

export default site;
```
