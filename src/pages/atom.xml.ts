import type { APIContext } from 'astro';
import { site as config } from '../data/site';
import { allEntries, urlFor, excerpt, xmlEscape as esc } from '../lib/content';
export async function GET({ site }: APIContext) {
  const entries = await allEntries();
  const absolute = (path: string) => new URL(path, site).href;
  const updated = entries.reduce(
    (max, entry) => Math.max(max, (entry.data.updated ?? entry.data.published).valueOf()),
    0,
  );
  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="zh-CN"><title>${esc(config.name)}</title><subtitle>${esc(config.description)}</subtitle><id>${absolute('/')}</id><link href="${absolute('/')}"/><link href="${absolute('/atom.xml')}" rel="self"/><updated>${new Date(updated).toISOString()}</updated><author><name>Climbing &amp; Playing</name></author>${entries.map((entry) => `<entry><id>${esc(absolute(urlFor(entry)))}</id><title>${esc(entry.data.title)}</title><link href="${esc(absolute(urlFor(entry)))}"/><published>${entry.data.published.toISOString()}</published><updated>${(entry.data.updated ?? entry.data.published).toISOString()}</updated><author><name>${esc(entry.data.author)}</name></author><summary>${esc(excerpt(entry))}</summary>${entry.data.tags.map((tag) => `<category term="${esc(tag)}"/>`).join('')}</entry>`).join('')}</feed>`,
    { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } },
  );
}
