# Lume Markdown Plugins

Collection of markdown-it plugins adapted to Lume

## Title

This plugin extracts the document title and save it in the `title` key of the
page data. Useful if you want to use plain markdown files, without front matter.

[See the demo](title/demo/)

## Image

This plugin extracts the document image and save it in the `image` key of the
page data. Useful if you want to use the first image as cover or open graph
image.

[See the demo](image/demo/)

## Toc

This plugin generates a table of contents (TOC) and save it in the `toc` key of
the page data, so you can insert it in your layouts. It also generate the
anchors of the headers.

[See the demo](toc/demo/)

## Usage

```ts
import toc from "https://deno.land/x/lume_markdown_plugins/toc.ts";
import title from "https://deno.land/x/lume_markdown_plugins/title.ts";
import image from "https://deno.land/x/lume_markdown_plugins/image.ts";

const site = lume()
  .use(toc())
  .use(title())
  .use(image());

export default site;
```
