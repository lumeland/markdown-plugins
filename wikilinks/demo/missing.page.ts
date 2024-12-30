export const renderOrder = 1;

export default function* ({ search }: Lume.Data) {
  const duplicates = new Set();

  for (const page of search.pages()) {
    for (const [url, title] of page.wikilinks) {
      if (duplicates.has(url)) {
        continue;
      }
      duplicates.add(url);

      yield {
        url,
        content: `<h1>${title}</h1>

        This page was not created yet.
        `,
      };
    }
  }
}
