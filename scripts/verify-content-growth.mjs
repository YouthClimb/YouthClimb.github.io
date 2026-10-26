import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const suffix = randomUUID();
const prefix = `integration-${suffix}`;
const entryFile = `src/content/entries/${prefix}.md`;
const draftFile = `src/content/entries/${prefix}-draft.md`;
const articlePath = `/stories/${prefix}/`;
const draftPath = `/stories/${prefix}-draft/`;
const title = `自动扩展验证 ${suffix}`;
const tag = `扩展验证-${suffix}`;
const astroPackage = JSON.parse(readFileSync('node_modules/astro/package.json', 'utf8'));
const astroBin = path.resolve(
  'node_modules/astro',
  typeof astroPackage.bin === 'string' ? astroPackage.bin : astroPackage.bin.astro,
);
const build = () => execFileSync(process.execPath, [astroBin, 'build'], { stdio: 'pipe' });
const entry = (draft) =>
  `---\ntitle: ${JSON.stringify(draft ? title + '草稿' : title)}\npublished: 2024-05-06T08:00:00Z\nauthor: 测试朋友\ncategories: [共同经历, 旅行]\ntags: [${tag}]\npermalink: ${draft ? draftPath : articlePath}\ncover: /media/banner.jpg\ncoverAlt: 一起看过的星空\ndraft: ${draft}\n---\n\n## 又一次出发\n\n这是一篇用于验证自动生成流程的临时经历。\n\n![地平线上的光](/media/banner.jpg)\n`;
try {
  writeFileSync(entryFile, entry(false), { flag: 'wx' });
  writeFileSync(draftFile, entry(true), { flag: 'wx' });
  build();
  for (const route of [
    articlePath,
    '/categories/共同经历/',
    '/categories/共同经历/旅行/',
    `/tags/${tag}/`,
    '/archives/2024/',
    '/archives/2024/05/',
  ]) {
    assert.ok(
      existsSync(path.join('dist', route, 'index.html')),
      `New route was not generated: ${route}`,
    );
  }
  assert.ok(
    !existsSync(path.join('dist', draftPath, 'index.html')),
    'Draft should not be published',
  );
  const homePages = [
    'dist/index.html',
    ...(existsSync('dist/page') ? readdirSync('dist/page') : [])
      .filter((item) => /^\d+$/.test(item))
      .map((page) => `dist/page/${page}/index.html`),
  ];
  const homeHtml = homePages.map((file) => readFileSync(file, 'utf8')).join('');
  const index = JSON.parse(readFileSync('dist/content.json', 'utf8'));
  assert.equal(
    [...homeHtml.matchAll(/class="entry-card"/g)].length,
    index.filter((entry) => entry.section === 'memories').length,
    'Every entry must appear once across homepage pagination',
  );
  assert.ok(
    homeHtml.includes(`href="${articlePath}">${title}</a>`),
    'New content absent from homepage pagination',
  );
  for (const file of ['dist/content.json', 'dist/atom.xml']) {
    const contents = readFileSync(file, 'utf8');
    assert.ok(contents.includes(title), `New content absent from ${file}`);
    assert.ok(!contents.includes(title + '草稿'), `Draft leaked into ${file}`);
  }
  assert.ok(
    readFileSync('dist/sitemap.xml', 'utf8').includes(articlePath),
    'New URL absent from sitemap',
  );
  execFileSync(
    process.execPath,
    [path.resolve('node_modules/@playwright/test/cli.js'), 'test', 'tests/growth.spec.ts'],
    {
      stdio: 'inherit',
      env: { ...process.env, YC_GROWTH_PATH: articlePath },
    },
  );
  console.log(
    'New Markdown generated its article, hierarchical categories, tag, year/month archive, pagination, search, feed and sitemap. Draft stayed hidden. Gallery and heading navigation passed in desktop and mobile browsers.',
  );
} finally {
  // These exact, unique files belong to this verification run.
  if (existsSync(entryFile)) unlinkSync(entryFile);
  if (existsSync(draftFile)) unlinkSync(draftFile);
  build();
}
