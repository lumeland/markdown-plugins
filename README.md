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

## Footnotes

Plugin to collect all footnotes and save them in the `footnotes` key of the page
data, allowing to insert them in the layouts.

## Usage

```ts
import toc from "https://deno.land/x/lume_markdown_plugins/toc.ts";
import title from "https://deno.land/x/lume_markdown_plugins/title.ts";
import image from "https://deno.land/x/lume_markdown_plugins/image.ts";
import footnotes from "https://deno.land/x/lume_markdown_plugins/footnotes.ts";

const site = lume()
  .use(toc())
  .use(title())
  .use(image());
  .use(footnotes());

export default site;
```
