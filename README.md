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

## References

Plugins to collect all internal references, so you can create the backlinks of
the pages. It creates the `references` variable in all pages with the URL of the
pages found. To create a list of backlinks, you can add the following code to
your templates:

```html
<ul>
  {{ for link of search.pages(`references*='${url}'`) }}
  <li><a href="{{ link.url }}">{{ link.title }}</a></li>
  {{ /for }}
</ul>
```

## Footnotes

Plugin to collect all footnotes and save them in the `footnotes` key of the page
data, allowing to insert them in the layouts.

## Usage

```ts
import toc from "lume_markdown_plugins/toc.ts";
import title from "lume_markdown_plugins/title.ts";
import image from "lume_markdown_plugins/image.ts";
import footnotes from "lume_markdown_plugins/footnotes.ts";

const site = lume()
  .use(toc())
  .use(title())
  .use(image());
  .use(footnotes());

export default site;
```
