import lume from "lume/mod.ts";
import wikilinks from "../../wikilinks.ts";

// Configure the markdown plugin
const site = lume();

site.data("layout", "default.vto");
site.use(wikilinks({
  basePath: "pages",
}));

export default site;
