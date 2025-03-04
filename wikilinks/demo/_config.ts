import lume from "lume/mod.ts";
import wikilinks from "../../wikilinks.ts";

// Configure the markdown plugin
const site = lume();

site.data("layout", "default.vto");
site.use(wikilinks());
site.process([".html"], (pages) => {
  for (const page of pages) {
    for (const link of page.document!.querySelectorAll("a[data-wikilink]")) {
      const id = link.getAttribute("data-wikilink");
      const found = pages.find((p) => p.data.id === id);
      link.removeAttribute("data-wikilink");

      if (found) {
        link.setAttribute("href", found.data.url);
      } else {
        link.setAttribute("title", "This page does not exist");
      }
    }
  }
});

export default site;
