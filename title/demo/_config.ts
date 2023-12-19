import lume from "lume/mod.ts";
import title from "../mod.ts";

// Configure the markdown plugin
const markdown = {
  plugins: [
    [title, { transform: (title: string) => title?.toUpperCase() }],
  ],
  keepDefaultPlugins: true,
};

const site = lume({}, { markdown });

site.data("layout", "default.vto");

export default site;
