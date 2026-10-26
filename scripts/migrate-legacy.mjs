// One-time migration. The original checkout must still be present and clean.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  unlinkSync,
  rmdirSync,
} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
if (existsSync('archive/migration.json'))
  throw new Error('This checkout has already been migrated.');
if (
  execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
    encoding: 'utf8',
  }).trim()
) {
  throw new Error('Commit changes to the original site before migrating.');
}
const sha = (value) => createHash('sha256').update(value).digest('hex');
const tracked = execFileSync('git', ['ls-files', '-z']).toString().split('\0').filter(Boolean);
const files = tracked.map((file) => ({ file, sha256: sha(readFileSync(file)) }));
mkdirSync('archive', { recursive: true });
execFileSync('git', ['archive', '--format=zip', '--output=archive/legacy-site.zip', 'HEAD']);
const snapshot = readFileSync('archive/legacy-site.zip');
if (snapshot.length < 1000 || snapshot[0] !== 0x50 || snapshot[1] !== 0x4b)
  throw new Error('Snapshot failed.');
mkdirSync('src/content/entries', { recursive: true });
mkdirSync('public/media', { recursive: true });
copyFileSync('css/images/banner.jpg', 'public/media/banner.jpg');
const index = JSON.parse(readFileSync('content.json', 'utf8'));
const entries = index.map((entry) => {
  const permalink = decodeURI(entry.url);
  const file = `${permalink.slice(1)}index.html`;
  const html = readFileSync(file, 'utf8');
  const body = html
    .match(
      /<div class="e-content article-entry" itemprop="articleBody">([\s\S]*?)\r?\n\s*<\/div>\r?\n\s*<footer class="article-footer">/,
    )?.[1]
    .trim();
  if (!body) throw new Error(`No article body: ${file}`);
  const published = html.match(/property="article:published_time" content="([^"]+)"/)[1];
  const updated = html.match(/property="article:modified_time" content="([^"]+)"/)[1];
  const name = permalink.slice(1, -1).replaceAll('/', '--');
  const output = `src/content/entries/${name}.md`;
  const data = {
    title: entry.title,
    published,
    updated,
    permalink,
    categories: entry.categories ?? [],
    tags: entry.tags ?? [],
    author: 'Climbing & Playing',
  };
  const frontmatter = Object.entries(data)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  writeFileSync(output, `---\n${frontmatter}\n---\n\n${body}\n`, 'utf8');
  return { title: entry.title, source: file, output, permalink, bodySha256: sha(body) };
});
const assets = files
  .filter(({ file }) => !file.endsWith('.html') && file !== 'content.json')
  .map(({ file, sha256 }) => {
    const output = `public/media/legacy/${file}`;
    mkdirSync(path.dirname(output), { recursive: true });
    copyFileSync(file, output);
    return { source: file, output, sha256 };
  });
writeFileSync(
  'archive/migration.json',
  JSON.stringify(
    {
      originalCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
      snapshotSha256: sha(snapshot),
      files,
      entries,
      assets,
      routes: files
        .filter(({ file }) => file.endsWith('index.html'))
        .map(({ file }) => '/' + file.replace(/index\.html$/, '')),
    },
    null,
    2,
  ) + '\n',
);
// Remove only the exact original files after all copies and the snapshot exist.
for (const { file, sha256 } of files) {
  if (sha(readFileSync(file)) !== sha256)
    throw new Error(`Original changed during migration: ${file}`);
}
for (const { file } of files) unlinkSync(path.resolve(root, file));
const directories = new Set(
  files.flatMap(({ file }) => {
    const parts = file.split('/');
    return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join('/'));
  }),
);
for (const dir of [...directories].sort((a, b) => b.length - a.length)) {
  try {
    rmdirSync(path.resolve(root, dir));
  } catch {
    /* Preserve any unrelated files. */
  }
}
console.log(
  `Migrated ${entries.length} complete articles, ${assets.length} assets; archived ${files.length} originals.`,
);
