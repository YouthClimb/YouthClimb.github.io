import { parseArgs } from 'node:util';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    category: { type: 'string', default: '共同经历' },
    tags: { type: 'string', default: '' },
    author: { type: 'string', default: 'Climbing & Playing' },
    slug: { type: 'string' },
    novel: { type: 'string' },
    chapter: { type: 'string' },
  },
});
const title = positionals.join(' ').trim();
if (!title) {
  console.error(
    '用法：npm run new -- "文章标题" --category "共同经历/旅行" --tags "朋友,旅行" --author "你的名字"',
  );
  process.exit(1);
}
const slug = (values.slug ?? title)
  .normalize('NFKC')
  .toLowerCase()
  .replace(/[^\p{L}\p{N}-]+/gu, '-')
  .replace(/^-+|-+$/g, '');
if (!slug) throw new Error('请提供包含文字或数字的标题 / --slug。');
const published = new Date().toISOString();
const date = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
const categories = values.category
  .split('/')
  .map((value) => value.trim())
  .filter(Boolean);
const tags = [
  ...new Set(
    values.tags
      .split(/[,，]/)
      .map((value) => value.trim())
      .filter(Boolean),
  ),
];
if (
  values.novel &&
  (!/^[a-z0-9-]+$/.test(values.novel) ||
    !values.chapter ||
    !Number.isInteger(Number(values.chapter)) ||
    Number(values.chapter) < 1)
)
  throw new Error('小说章节须提供 --novel 作品文件ID --chapter 正整数。');
if (values.chapter && !values.novel) throw new Error('--chapter 必须与 --novel 一起使用。');
const metadata = {
  title,
  section: values.novel ? 'novels' : 'memories',
  ...(values.novel ? { novel: values.novel, chapter: Number(values.chapter) } : {}),
  published,
  author: values.author,
  categories: values.novel && values.category === '共同经历' ? [] : categories,
  tags,
  draft: true,
};
const file = path.join('src', 'content', 'entries', `${date}-${slug}.md`);
mkdirSync(path.dirname(file), { recursive: true });
writeFileSync(
  file,
  `---\n${Object.entries(metadata)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(
      '\n',
    )}\n---\n\n在这里写下你们的故事。\n\n<!-- 图片放入 public/media/，引用示例：![一起走过的地方](/media/2026/trip/photo.jpg) -->\n`,
  { encoding: 'utf8', flag: 'wx' },
);
console.log(`已创建草稿：${file}\n写完后将 draft 改为 false，即可参与页面、归档、搜索与订阅生成。`);
