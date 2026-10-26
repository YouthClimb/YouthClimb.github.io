import type { APIContext } from 'astro';
import { allEntries, allNovels, routesFor, xmlEscape as esc } from '../lib/content';
export async function GET({ site }: APIContext) {
  const routes = routesFor(await allEntries(), await allNovels());
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${esc(new URL(route.path ? `/${route.path}/` : '/', site).href)}</loc>${route.entry ? `<lastmod>${(route.entry.data.updated ?? route.entry.data.published).toISOString()}</lastmod>` : ''}</url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
