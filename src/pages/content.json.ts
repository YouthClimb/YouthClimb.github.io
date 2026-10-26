import { allEntries, urlFor, plainText, excerpt, dateLabel, sectionLabel } from '../lib/content';
export async function GET() {
  const entries = await allEntries();
  return Response.json(
    entries.map((entry) => ({
      title: entry.data.title,
      section: entry.data.section,
      sectionLabel: sectionLabel(entry),
      novel: entry.data.novel,
      url: urlFor(entry),
      content: plainText(entry.body),
      description: excerpt(entry),
      categories: entry.data.categories,
      tags: entry.data.tags,
      author: entry.data.author,
      date: dateLabel(entry.data.published),
    })),
  );
}
