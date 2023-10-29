import lume from "lume/mod.ts";
import toc from "../../toc.ts";

const site = lume();

site.use(toc({
  slugify: {
    separator: "_",
    lowercase: true,
  },
}));

export default site;
