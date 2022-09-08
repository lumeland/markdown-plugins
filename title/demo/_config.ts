import lume from "lume/mod.ts";
import title from "../mod.ts";

// Configure the markdown plugin
const markdown = {
  plugins: [title],
  keepDefaultPlugins: true,
};

const site = lume({}, { markdown });

site.data("layout", "default.njk");

export default site;
