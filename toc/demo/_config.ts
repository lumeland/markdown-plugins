import lume from "lume/mod.ts";
import toc from "../mod.ts";

// Configure the markdown plugin
const markdown = {
  plugins: [toc],
  keepDefaultPlugins: true,
};

const site = lume({}, { markdown });

export default site;
