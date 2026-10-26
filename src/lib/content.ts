import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';
import legacyManifest from '../../archive/migration.json';

export type Entry = CollectionEntry<'entries'>;
export type Novel = CollectionEntry<'novels'>;
export const isMemory = (entry: Entry) => entry.data.section === 'memories';
export const novelUrl = (id: string) => `/novels/${encodeURIComponent(id)}/`;
export const urlFor = (entry: Entry) =>
  entry.data.permalink ??
  (entry.data.section === 'novels'
    ? `${novelUrl(entry.data.novel!)}${entry.id}/`
    : `/stories/${entry.id}/`);
export const sectionLabel = (entry: Entry) =>
  ({ memories: '共同经历', novels: '小说', legacy: '旧站文档' })[entry.data.section];
export const chaptersFor = (entries: Entry[], id: string) =>
  entries
    .filter((entry) => entry.data.section === 'novels' && entry.data.novel === id)
    .sort(
      (a, b) =>
        (a.data.chapter ?? Infinity) - (b.data.chapter ?? Infinity) ||
        a.data.published.valueOf() - b.data.published.valueOf(),
    );
export async function allNovels() {
  return (await getCollection('novels')).sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'zh-CN'),
  );
}
export const categoryUrl = (parts: string[]) =>
  `/categories/${parts.map(encodeURIComponent).join('/')}/`;
export const tagUrl = (tag: string) => `/tags/${encodeURIComponent(tag)}/`;
export const dateLabel = (date: Date) =>
  new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replaceAll('/', '.');
export const monthKey = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
  })
    .format(date)
    .replaceAll('/', '-');

export function plainText(body = ''): string {
  return body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#*_`~>]/g, '')
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code: string) => {
      const value = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
      return value <= 0x10ffff ? String.fromCodePoint(value) : '';
    })
    .replace(
      /&(amp|lt|gt|quot|apos|nbsp);/g,
      (_, key: string) =>
        ({
          amp: '&',
          lt: '<',
          gt: '>',
          quot: '"',
          apos: "'",
          nbsp: ' ',
        })[key] ?? '',
    )
    .replace(/\s+/g, ' ')
    .trim();
}
export const excerpt = (entry: Entry) =>
  entry.data.description ??
  plainText(entry.body).slice(0, 108) + (plainText(entry.body).length > 108 ? '…' : '');
export const readingTime = (entry: Entry) =>
  Math.max(1, Math.ceil(plainText(entry.body).length / 450));

export async function allEntries() {
  return (await getCollection('entries', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf() || a.id.localeCompare(b.id),
  );
}

export function categoriesFor(entries: Entry[]) {
  const map = new Map<string, { name: string; parts: string[]; entries: Entry[] }>();
  for (const entry of entries) {
    entry.data.categories.forEach((name, index, parts) => {
      const prefix = parts.slice(0, index + 1);
      const key = prefix.join('/');
      const item = map.get(key) ?? { name, parts: prefix, entries: [] };
      item.entries.push(entry);
      map.set(key, item);
    });
  }
  return [...map.values()].sort((a, b) =>
    a.parts.join('/').localeCompare(b.parts.join('/'), 'zh-CN'),
  );
}

export function tagsFor(entries: Entry[]) {
  return [...new Set(entries.flatMap((entry) => entry.data.tags))]
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
    .map((name) => ({ name, entries: entries.filter((entry) => entry.data.tags.includes(name)) }));
}

export type SiteRoute = {
  path?: string;
  kind:
    | 'home'
    | 'archive'
    | 'category'
    | 'tag'
    | 'categories'
    | 'tags'
    | 'article'
    | 'novels'
    | 'novel';
  title: string;
  entries: Entry[];
  page?: number;
  pages?: number;
  entry?: Entry;
  novel?: Novel;
  scope?: 'memories' | 'all';
};

export function routesFor(entries: Entry[], novels: Novel[]): SiteRoute[] {
  for (const entry of entries) {
    if (entry.data.section === 'novels' && !novels.some((novel) => novel.id === entry.data.novel))
      throw new Error(
        `Unknown novel for ${entry.data.title}. Set novel to a file ID in src/content/novels/.`,
      );
  }
  const memories = entries.filter(isMemory);
  const pages = Math.max(1, Math.ceil(memories.length / site.pageSize));
  const routes: SiteRoute[] = Array.from({ length: pages }, (_, index) => ({
    path: index ? `page/${index + 1}` : undefined,
    kind: 'home',
    title: '共同记录',
    entries: memories.slice(index * site.pageSize, (index + 1) * site.pageSize),
    page: index + 1,
    pages,
  }));
  routes.push({ path: 'archives', kind: 'archive', title: '时光归档', entries: memories });
  const months = [...new Set(memories.map((entry) => monthKey(entry.data.published)))];
  for (const year of [...new Set(months.map((month) => month.slice(0, 4)))]) {
    routes.push({
      path: `archives/${year}`,
      kind: 'archive',
      title: `${year} 年的记录`,
      entries: memories.filter((entry) => monthKey(entry.data.published).startsWith(year)),
    });
  }
  for (const month of months) {
    routes.push({
      path: `archives/${month.replace('-', '/')}`,
      kind: 'archive',
      title: `${month.slice(0, 4)} 年 ${Number(month.slice(5))} 月`,
      entries: memories.filter((entry) => monthKey(entry.data.published) === month),
    });
  }
  routes.push({
    path: 'novels',
    kind: 'novels',
    title: '小说',
    entries: entries.filter((entry) => entry.data.section === 'novels'),
  });
  for (const novel of novels)
    routes.push({
      path: `novels/${novel.id}`,
      kind: 'novel',
      title: novel.data.title,
      entries: chaptersFor(entries, novel.id),
      novel,
    });
  routes.push({ path: 'categories', kind: 'categories', title: '共同经历分类', entries: memories });
  for (const category of categoriesFor(entries)) {
    const novel = novels.find((item) => item.data.title === category.parts[1]);
    const fiction = category.entries.every((entry) => entry.data.section === 'novels');
    routes.push({
      path: `categories/${category.parts.join('/')}`,
      kind: fiction ? (novel ? 'novel' : 'novels') : 'category',
      title: category.parts.join(' / '),
      entries: category.entries,
      novel,
    });
  }
  routes.push({ path: 'tags', kind: 'tags', title: '内容标签', entries, scope: 'all' });
  for (const tag of tagsFor(entries)) {
    routes.push({
      path: `tags/${tag.name}`,
      kind: 'tag',
      title: `# ${tag.name}`,
      entries: tag.entries,
      scope: 'all',
    });
  }
  // Keep incoming links from the original site without mixing novels into memories.
  for (const legacyPath of legacyManifest.routes) {
    const path = legacyPath.slice(1, -1) || undefined;
    if (routes.some((route) => route.path === path)) continue;
    if (path?.startsWith('archives/'))
      routes.push({ path, kind: 'archive', title: '时光归档', entries: [] });
    else if (path?.startsWith('page/'))
      routes.push({ path, kind: 'home', title: '共同记录', entries: [], page: 1, pages: 1 });
  }
  for (const entry of entries) {
    routes.push({
      path: urlFor(entry).slice(1, -1),
      kind: 'article',
      title: entry.data.title,
      entries,
      entry,
    });
  }
  const seen = new Set([
    'search',
    '404',
    'atom.xml',
    'content.json',
    'sitemap.xml',
    'robots.txt',
    'media',
  ]);
  for (const route of routes) {
    const key = route.path ?? '';
    if (seen.has(key) || key.startsWith('media/'))
      throw new Error(`Duplicate or reserved URL: /${key}/. Change the entry permalink.`);
    seen.add(key);
  }
  return routes;
}

export const xmlEscape = (value: string) =>
  value.replace(
    /[<>&"']/g,
    (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!,
  );
