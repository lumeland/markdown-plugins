# markdown-plugins

Collection of markdown-it plugins adapted to Lume

> Warning: Only works with the latest development version of Lume

## Toc

This plugin generates a table of contents (TOC) and store it in the page data,
so you can insert it in your layouts. It also generate the anchors of the
headers.

### Installation

Import and use it in your _config file:

```ts
import lume from "lume/mod.ts";
import toc from "markdown-plugins/toc/mod.ts";

// Configure the markdown plugin
const markdown = {
  plugins: [toc],
  keepDefaultPlugins: true,
};

const site = lume({}, { markdown });

export default site;
```

### Usage

Create a markdown page with titles and subtitles:

```md
---
title: This is a title
layout: default.njk
---

Content

## This is a subtitle

More content

### And this a sub-subtitle

The end
```

Now, in your layout (`default.njk` in this example) you have the `toc` variable
with all titles:

```njk
<header class="doc-header">
  <h1>{{ title }}</h1>

  {% if toc.length %}  
  <nav class="toc">
    <ol>
      {% for item in toc %}
      <li>
        <a href="#{{ item.slug }}">{{ item.text }}</a>

        {% if item.children.length %}
        <ul>
          {% for child in item.children %}
          <li>
            <a href="#{{ child.slug }}">{{ child.text }}</a>
          </li>
          {% endfor %}
        </ul>
        {% endif %}
      </li>
      {% endfor %}
    </ol>
  </nav>
  {% endif %}
</header>

{{ content | safe }}
```
