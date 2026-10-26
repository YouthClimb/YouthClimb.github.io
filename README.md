# YouthClimb

一群朋友的共同记录。使用 **Astro 7 + TypeScript + Markdown 内容集合**，构建为可直接部署到 GitHub Pages 的静态文件，无需数据库或常驻服务。

共同经历与小说分为独立板块：`/` 和 `/archives/` 只收录真实的共同经历；`/novels/` 是原创小说寄存处，下设《生说》和《御光师》。当前尚未上传共同经历或其他文档，首页及归档显示空状态。5 篇小说章节全部归入小说板块；Hello World 作为旧站示例保留，不计入共同经历。

## 本地启动

推荐 Node.js 24 LTS（最低 22.23.4）和 npm。

```sh
npm ci
npm run dev
```

打开终端显示的本地地址，通常为 `http://localhost:4321`。

```sh
npm run check      # 内容结构和 TypeScript 检查
npm run build      # 输出到 dist/
npm run verify     # 正文、原始资源、旧地址、站内链接检查
npm run preview    # 预览构建结果
npm run format     # 统一格式，不改写迁移原文或历史资源
```

## 新增一段经历：只改内容，不改页面

```sh
npm run new -- "我们的周末远足" --category "共同经历/旅行" --tags "朋友,远足" --author "你的名字"
```

命令在 `src/content/entries/` 生成一篇 `section: memories` 的 Markdown **草稿**。写完后把 `draft: true` 改为 `draft: false`。重新构建时，首页分页、分层分类、标签云、年月归档、最新文章、相邻文章、搜索索引、Atom 订阅和 sitemap 都会自动更新。新建分类或标签不需要注册，也不需要复制页面。

也可以直接添加 `.md` 文件。正文支持标准 Markdown、表格、代码块、原生 HTML、图片及视频：

```markdown
---
title: 一起看过的日落
section: memories
published: 2026-10-26T18:00:00+08:00
author: 朋友的名字
categories: [共同经历, 旅行]
tags: [朋友, 日落]
description: 这一天，我们走到了山顶。
cover: /media/2026/autumn/sunset.jpg
coverAlt: 山顶的落日
draft: false
---

## 出发

把那天的故事写在这里。

![山顶合影](/media/2026/autumn/group.jpg)

<video controls preload="metadata" src="/media/2026/autumn/clip.mp4"></video>
```

`title` 和 `published` 必填；其他字段可选。`categories` 是**由上到下的一条分类层级**，并非多个平行分类；多个主题用 `tags` 表达。分类名、标签名不能包含 `/ ? # % \`，路径层级用数组表达。发布时间及归档按北京时间展示。

默认地址为 `/stories/文件名/`（由 Astro 生成内容 ID）。需要固定地址时，添加 `permalink: /stories/sunset/`。固定地址须以 `/` 开头和结尾，不能带查询参数、编码字符或路径回退，不能与已有页面或系统资源重名；冲突会让构建明确报错。正文修改不会改变旧地址。旧文章保留原有 `books/...` 和 `hello-world/` 地址。

## 小说寄存板块

两部作品的入口分别为 `/novels/shengshuo/`、`/novels/yuguangshi/`。章节按照 `chapter` 数字升序排列，前后章只在同一部作品内切换；《生说》保留已上传的第 13–15 话，《御光师》保留第一卷第 1–2 章，不补造缺失章节或真实经历。

新增章节：

```sh
npm run new -- "第16话 标题" --novel shengshuo --chapter 16 --category "小说/生说"
```

小说章节使用 `section: novels`、`novel: shengshuo` 和 `chapter: 16`。`novel` 必须对应 `src/content/novels/` 内的作品 JSON 文件名。新作品只需在该目录新增 JSON（`title`、`description`、`order`），然后添加对应 Markdown 章节，小说首页与作品目录自动生成。小说不会计入共同经历首页、分类或年月归档。

`section: legacy` 用于旧站示例文档。全站标签、搜索和 Atom 订阅继续保留所有已发布内容；搜索结果和阅读页明确标注“共同经历 / 小说 / 旧站文档”。原来的小说分类地址仍可访问对应小说目录，旧分页和年月链接保留，但不会混入小说充当共同经历。

## 内容和资源在哪里

```text
src/
  content/entries/      所有文章、小说与经历（Markdown）
  content/novels/       小说作品元数据（JSON，独立生成作品子板块）
  content.config.ts    内容字段校验
  data/site.ts         站名、导航、简介和每页数量
  lib/content.ts       分类、标签、时间与路由生成
  components/          可复用界面
  layouts/             统一 HTML 框架与元信息
  pages/               静态页面和订阅、搜索等文件入口
  scripts/             搜索、阅读和图片预览交互
  styles/              全站样式
public/
  media/               集中存放图片、视频、音频等资源
    banner.jpg         原站横幅，继续在新版使用
    legacy/            原站字体、CSS、jQuery、Fancybox 等完整资源副本
  favicon.svg          新版图标
archive/
  legacy-site.zip      重构前全部 34 个文件的原始快照
  migration.json       原始提交、文件及正文校验清单
scripts/               内容创建和迁移验证工具
tests/                 桌面与手机浏览器测试
```

媒体可以按年份、活动或故事分子文件夹，例如 `public/media/2026/autumn/`。页面引用省略 `public`：`/media/2026/autumn/group.jpg`。原来的字体和第三方脚本保留在 `public/media/legacy/`，新版交互不再依赖它们。

新增内容一般只需修改 **`src/content/entries/` 和 `public/media/`**。网站文字、导航及分页规则统一修改 `src/data/site.ts`；域名修改 `astro.config.mjs` 和 `public/robots.txt`。首页、归档和分类数量全部从内容计算，不需要手工更新计数。

## 已保留与改进的功能

完整盘点见 [docs/原站功能与迁移.md](docs/原站功能与迁移.md)。迁移了 6 篇完整正文、原发布时间和更新时间、分类、标签及全部旧页面地址；原版 HTML 正文保留在 Markdown 中，便于逐字校验。新内容直接用 Markdown 编写即可。

- 共同经历首页、分页、分类、年月归档与最近记录；独立的小说板块、作品目录与分卷目录；全站内容标签。
- 全文、共同经历相邻文章、同一小说的上一章 / 下一章、分享链接和四个原有社交分享目标。
- 手机导航、图片预览和图片说明；新图片自动支持预览，支持键盘和前后切换。
- 搜索升级为站内全文检索，覆盖标题、正文、分类、标签和作者，支持查询 URL。
- 新增小说作品目录、阅读字号记忆、阅读进度、文章目录、404、canonical 与分享元信息。
- 修复原站缺失的 Atom 订阅文件和网站图标；订阅地址仍为 `/atom.xml`。

页面正文、导航与归档可在禁用 JavaScript 时阅读。搜索、复制链接、字号和图片弹窗使用少量客户端脚本。站点不提供在线编辑、多人登录或云端上传；朋友可通过 Git 修改内容、提交 PR。视频、音频使用 Markdown 内的原生 HTML 标签即可，媒体文件仍集中管理。

## 验证

```sh
npx playwright install chromium
npm run test:e2e
npm run test:growth
```

`test:e2e` 验证桌面和手机上的核心流程，使用独立的 `4322` 端口预览构建产物，不复用正在浏览的开发服务器。`test:growth` 临时添加一篇含封面、图片和新分类/标签的文章以及一篇草稿，实际构建并检查自动生成结果，再验证图片弹窗与文章目录，最后删除临时文件并恢复正式构建。运行时不要同时修改内容或执行其他构建。

Windows 如果已有 Chrome，可以在 PowerShell 中指定，省去下载测试浏览器：

```powershell
$env:PLAYWRIGHT_CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
npm run test:e2e
npm run test:growth
```

`npm run verify` 专门保护迁移基线：原有正文和资源的哈希、原站快照、21 个旧页面地址、构建中的正文及站内链接都会检查。今后若**有意修改原有 6 篇历史文章**，该检查会提示不再与原版一致；审阅内容后同步更新 `archive/migration.json` 中对应正文哈希，保留原站 ZIP 不动。新文章不会影响迁移基线。

## GitHub Pages

已配置 `.github/workflows/deploy.yml`：向 `master` 或 `main` 推送后，安装依赖、检查类型、构建、验证迁移与链接、执行浏览器测试及新增内容测试，再发布 `dist/`；PR 只检查，不发布。

仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。本站是 `YouthClimb.github.io` 的根站点，默认不设置子路径。部署配置参考 [Astro 官方 GitHub Pages 指南](https://docs.astro.build/en/guides/deploy/github/)；内容架构参考 [Astro 内容集合](https://docs.astro.build/en/guides/content-collections/)。

`scripts/migrate-legacy.mjs` 是已执行的一次性迁移记录，不需要再次运行。发布由上述工作流处理，首次部署前请确认远程 Pages 已选择 GitHub Actions。
