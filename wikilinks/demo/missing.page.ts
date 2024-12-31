export const renderOrder = 1;

export default function* ({ wikilinks }: Lume.Data) {
  for (const { url, title } of wikilinks.missing()) {
    yield {
      url,
      content: `<h1>${title}</h1>

      This page was not created yet.
      `,
    };
  }
}
