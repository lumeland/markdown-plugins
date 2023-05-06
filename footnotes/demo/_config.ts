import lume from "lume/mod.ts";
import footnote from "../mod.ts";

// Configure the markdown plugin
const markdown = {
  plugins: [
    footnote,
  ],
  keepDefaultPlugins: true,
};

const site = lume({}, { markdown });

site.data("layout", "default.njk");

export default site;
