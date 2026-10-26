import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';

const sha = (value) => createHash('sha256').update(value).digest('hex');
const manifest = JSON.parse(readFileSync('archive/migration.json', 'utf8'));
assert.equal(
  sha(readFileSync('archive/legacy-site.zip')),
  manifest.snapshotSha256,
  'Original site snapshot changed',
);
const visible = (html) => html.replace(/<[^>]*>/g, '').replace(/\s+/g, '');
for (const entry of manifest.entries) {
  const markdown = readFileSync(entry.output, 'utf8');
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();
  assert.equal(sha(body), entry.bodySha256, `Migrated body differs: ${entry.title}`);
  const output = path.join('dist', entry.permalink, 'index.html');
  const html = readFileSync(output, 'utf8');
  const rendered = html.match(
    /<div class="prose" id="story-content">([\s\S]*?)<\/div>\s*<footer class="story-footer">/,
  )?.[1];
  assert.ok(rendered, `No rendered body: ${entry.title}`);
  assert.equal(visible(rendered), visible(body), `Rendered article lost content: ${entry.title}`);
}
for (const asset of manifest.assets)
  assert.equal(
    sha(readFileSync(asset.output)),
    asset.sha256,
    `Original asset changed: ${asset.source}`,
  );
assert.equal(
  sha(readFileSync('public/media/banner.jpg')),
  manifest.assets.find((asset) => asset.source === 'css/images/banner.jpg').sha256,
);
for (const route of manifest.routes)
  assert.ok(existsSync(path.join('dist', route, 'index.html')), `Missing legacy route: ${route}`);

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((item) =>
    item.isDirectory() ? files(path.join(dir, item.name)) : [path.join(dir, item.name)],
  );
const htmlFiles = files('dist').filter((file) => file.endsWith('.html'));
let links = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const url = file
    .replaceAll(path.sep, '/')
    .replace(/^dist/, '')
    .replace(/index\.html$/, '');
  for (const match of html.matchAll(/\b(?:href|src)="([^"<>]+)"/g)) {
    const target = match[1].replaceAll('&amp;', '&');
    if (/^(https?:|mailto:|data:|tel:|\/\/)/i.test(target)) continue;
    const resolved = new URL(target, `https://local.test${url}`);
    const local = path.join('dist', decodeURIComponent(resolved.pathname));
    const destination = resolved.pathname.endsWith('/') ? path.join(local, 'index.html') : local;
    assert.ok(existsSync(destination), `Broken local link from ${file}: ${target}`);
    if (resolved.hash && destination.endsWith('.html')) {
      const targetHtml = readFileSync(destination, 'utf8');
      const hash = decodeURIComponent(resolved.hash.slice(1));
      assert.ok(targetHtml.includes(`id="${hash}"`), `Missing anchor from ${file}: ${target}`);
    }
    links++;
  }
  assert.ok(html.includes('lang="zh-CN"'), `Missing document language: ${file}`);
  assert.ok(html.includes('rel="canonical"'), `Missing canonical URL: ${file}`);
}
const index = JSON.parse(readFileSync('dist/content.json', 'utf8'));
for (const entry of manifest.entries) {
  const item = index.find((item) => item.url === entry.permalink);
  assert.ok(item?.content.length > 30, `Empty full-text index: ${entry.title}`);
  assert.ok(
    readFileSync('dist/atom.xml', 'utf8').includes(entry.title.replaceAll('&', '&amp;')),
    `Missing feed entry: ${entry.title}`,
  );
}
assert.ok(existsSync('dist/sitemap.xml'));
assert.ok(existsSync('dist/favicon.svg'));
assert.ok(existsSync('dist/.nojekyll'));
console.log(
  `Verified ${manifest.entries.length} unchanged article bodies, ${manifest.assets.length} original assets, ${manifest.routes.length} legacy routes, ${htmlFiles.length} HTML pages and ${links} internal links / anchors.`,
);
