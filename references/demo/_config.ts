import lume from "lume/mod.ts";
import backlinks from "../mod.ts";

// Configure the markdown plugin
const markdown = {
  plugins: [backlinks],
};

const site = lume({}, { markdown });

site.data("layout", "default.vto");

export default site;
