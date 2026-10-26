import { test, expect } from '@playwright/test';
import { site } from '../src/data/site';

interface IndexedEntry {
  title: string;
  url: string;
  categories: string[];
  tags: string[];
  date: string;
  section: 'memories' | 'novels' | 'legacy';
  novel?: string;
}

test('首页、分页和手机导航', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const index: IndexedEntry[] = await (await page.request.get('/content.json')).json();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('一起走过的日子');
  const memories = index.filter((entry) => entry.section === 'memories');
  await expect(page.locator('.entry-card')).toHaveCount(Math.min(site.pageSize, memories.length));
  if (!memories.length) {
    await expect(page.locator('.empty-state')).toContainText('共同经历，等待上传');
    await expect(page.locator('.home-page')).not.toContainText('Chapter 2');
    await expect(page.locator('.home-page')).not.toContainText('Hello World');
  }
  await expect(page.locator('.hero-visual img')).toHaveJSProperty('naturalWidth', 1920);
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true });
  if (memories.length > site.pageSize) {
    await page.getByRole('link', { name: '第 2 页', exact: true }).click();
    await expect(page).toHaveURL(/\/page\/2\//);
    await expect(page.locator('.entry-card h3').first()).toHaveText(memories[site.pageSize].title);
  }
  if (testInfo.project.name === 'mobile') {
    await page.locator('.mobile-menu summary').click();
    await page
      .getByRole('navigation', { name: '移动导航' })
      .getByRole('link', { name: '时光归档' })
      .click();
  } else {
    await page
      .getByRole('navigation', { name: '主导航', exact: true })
      .getByRole('link', { name: '时光归档' })
      .click();
  }
  await expect(page.locator('.timeline li')).toHaveCount(memories.length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});

test('分层分类、标签与年月归档', async ({ page }) => {
  const index: IndexedEntry[] = await (await page.request.get('/content.json')).json();
  await page.goto('/categories/小说/御光师/第一卷/');
  await expect(page.locator('.chapter-list li')).toHaveCount(
    index.filter((entry) => entry.categories.slice(0, 3).join('/') === '小说/御光师/第一卷').length,
  );
  await page.goto('/tags/PT/');
  await expect(page.locator('.entry-card')).toHaveCount(
    index.filter((entry) => entry.tags.includes('PT')).length,
  );
  await page.goto('/archives/2023/03/');
  await expect(page.locator('.timeline li')).toHaveCount(
    index.filter((entry) => entry.section === 'memories' && entry.date.startsWith('2023.03'))
      .length,
  );
  await page.goto('/categories/');
  const categories = new Set(
    index
      .filter((entry) => entry.section === 'memories')
      .flatMap((entry) =>
        entry.categories.map((_, i) => entry.categories.slice(0, i + 1).join('/')),
      ),
  );
  await expect(page.locator('.collection-card')).toHaveCount(categories.size);
});

test('全文检索、空结果和 URL 查询', async ({ page }) => {
  await page.goto('/search/?q=运动会');
  await expect(page.locator('#search-results')).toContainText('15话 训练');
  const input = page.getByRole('searchbox');
  await input.fill('JYCao');
  await expect(page.locator('#search-results')).toContainText('Chapter 1 奇怪的戒指');
  await expect(page.locator('#search-results')).toContainText('Chapter 2 相识');
  await input.fill('不存在的测试关键词xyzy');
  await expect(page.locator('#search-status')).toContainText('还没找到');
  await input.fill('<img src=x onerror=alert(1)>');
  await expect(page.locator('#search-status')).toContainText('还没找到');
  await expect(page.locator('#search-results img')).toHaveCount(0);
  await input.fill('');
  await expect(page.locator('#search-status')).toContainText('输入关键词');
});

test('保留正文、相邻文章、字号记忆和分享', async ({ page }) => {
  const index: IndexedEntry[] = await (await page.request.get('/content.json')).json();
  await page.goto('/books/shengshuo/15话-训练/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('15话 训练');
  await expect(page.locator('#story-content')).toContainText('理南达成了远程挨打的效果');
  await expect(page.locator('.series-list a')).toHaveCount(
    index.filter((entry) => entry.novel === 'shengshuo').length,
  );
  const prose = page.locator('#story-content');
  await page.getByRole('button', { name: '放大正文字号' }).click();
  await expect(prose).toHaveCSS('font-size', '18px');
  await page.reload();
  await expect(prose).toHaveCSS('font-size', '18px');
  await page.getByRole('button', { name: '分享', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '把故事分享给朋友' })).toBeVisible();
  await expect(page.locator('#share-url')).toHaveValue(
    /https:\/\/youthclimb.github.io\/books\/shengshuo\//,
  );
  await page.keyboard.press('Escape');
  await expect(page.locator('#share-dialog')).not.toBeVisible();
  await expect(page.locator('.reading-toolbar')).toContainText('原创小说 · 虚构作品');
  await expect(page.locator('.article-navigation')).not.toContainText('御光师');
  await expect(page.locator('.article-navigation')).not.toContainText('Hello World');
  await page
    .locator('.article-navigation')
    .getByRole('link', { name: /上一章/ })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('14话 筹划');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('小说独立板块与两部作品的章节目录', async ({ page }, testInfo) => {
  const index: IndexedEntry[] = await (await page.request.get('/content.json')).json();
  await page.goto('/novels/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('小说.');
  expect(await page.locator('.novel-card').count()).toBeGreaterThanOrEqual(2);
  await expect(page.locator('.page-heading')).toContainText('独立于共同经历记录');
  await page.screenshot({ path: testInfo.outputPath('novels.png'), fullPage: true });
  await page.locator('.novel-card h3').getByRole('link', { name: '《生说》', exact: true }).click();
  await expect(page).toHaveURL(/\/novels\/shengshuo\//);
  await expect(page.locator('.chapter-list li')).toHaveCount(
    index.filter((entry) => entry.novel === 'shengshuo').length,
  );
  const chapterNumbers = (await page.locator('.chapter-number').allTextContents()).map(Number);
  expect(chapterNumbers).toEqual([...chapterNumbers].sort((a, b) => a - b));
  await expect(page.locator('.chapter-list')).toContainText('13话 工地行者');
  await page.goto('/novels/yuguangshi/');
  await expect(page.locator('.chapter-list li')).toHaveCount(
    index.filter((entry) => entry.novel === 'yuguangshi').length,
  );
  await expect(page.locator('.chapter-group h2').first()).toHaveText('第一卷');
  await page.locator('.chapter-list a').first().click();
  await expect(page.locator('.article-navigation')).not.toContainText('生说');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chapter 1 奇怪的戒指');
  await expect(
    page.locator('.article-navigation').getByRole('link', { name: /下一章/ }),
  ).toContainText('Chapter 2 相识');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test('订阅和索引有效，浏览无需客户端路由', async ({ request, browser, baseURL }) => {
  const feed = await request.get('/atom.xml');
  expect(feed.ok()).toBe(true);
  const index: IndexedEntry[] = await (await request.get('/content.json')).json();
  expect((await feed.text()).match(/<entry>/g)).toHaveLength(index.length);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/books/yuguangshi/Chapter-2-相识/`);
  await expect(page.locator('#story-content')).toContainText(
    '孟槐作为第一个社员加入了Crime Crashers',
  );
  await context.close();
});
