export {};
interface SearchEntry {
  title: string;
  url: string;
  content: string;
  description: string;
  categories: string[];
  tags: string[];
  author: string;
  date: string;
  sectionLabel: string;
}
const form = document.querySelector<HTMLFormElement>('.search-form')!;
const input = document.querySelector<HTMLInputElement>('#search-input')!;
const status = document.querySelector<HTMLElement>('#search-status')!;
const results = document.querySelector<HTMLElement>('#search-results')!;
let indexPromise: Promise<SearchEntry[]> | undefined;
let request = 0;
const loadIndex = () =>
  (indexPromise ??= fetch('/content.json')
    .then((response) => {
      if (!response.ok) throw new Error('Index unavailable');
      return response.json() as Promise<SearchEntry[]>;
    })
    .catch((error: unknown) => {
      indexPromise = undefined;
      throw error;
    }));
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase();

async function search() {
  const id = ++request;
  const query = input.value.trim();
  results.replaceChildren();
  if (!query) {
    status.textContent = '输入关键词，搜索共同经历、小说与旧站文档。';
    return;
  }
  status.textContent = '正在翻找记录…';
  try {
    const entries = await loadIndex();
    if (id !== request) return;
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    const matches = entries
      .filter((entry) =>
        tokens.every((token) =>
          normalize(
            [entry.title, entry.content, ...entry.categories, ...entry.tags, entry.author].join(
              ' ',
            ),
          ).includes(token),
        ),
      )
      .sort(
        (a, b) =>
          Number(normalize(b.title).includes(normalize(query))) -
          Number(normalize(a.title).includes(normalize(query))),
      );
    status.textContent = matches.length
      ? `找到 ${matches.length} 篇与「${query}」有关的内容。`
      : `还没找到与「${query}」有关的内容，试试更短的词或其他标签。`;
    for (const entry of matches) {
      const article = document.createElement('article');
      article.className = 'search-result';
      const meta = document.createElement('span');
      meta.textContent = `${entry.sectionLabel} · ${entry.date}${entry.categories.length ? ' · ' + entry.categories.join(' / ') : ''}`;
      const heading = document.createElement('h2');
      const link = document.createElement('a');
      link.href = entry.url;
      link.textContent = entry.title;
      heading.append(link);
      const description = document.createElement('p');
      const offset = Math.max(0, normalize(entry.content).indexOf(tokens[0]) - 40);
      description.textContent = `${offset > 0 ? '…' : ''}${entry.content.slice(offset, offset + 160)}${entry.content.length > offset + 160 ? '…' : ''}`;
      article.append(meta, heading, description);
      results.append(article);
    }
  } catch {
    if (id === request) status.textContent = '搜索索引暂时无法读取，请检查网络后再次点击搜索。';
  }
}
function updateUrl() {
  const url = new URL(window.location.href);
  if (input.value.trim()) url.searchParams.set('q', input.value.trim());
  else url.searchParams.delete('q');
  history.replaceState(null, '', url);
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  updateUrl();
  void search();
});
let debounce: ReturnType<typeof setTimeout>;
input.addEventListener('input', () => {
  clearTimeout(debounce);
  request++;
  debounce = setTimeout(() => {
    updateUrl();
    void search();
  }, 180);
});
window.addEventListener('popstate', () => {
  input.value = new URLSearchParams(location.search).get('q') ?? '';
  void search();
});
input.value = new URLSearchParams(window.location.search).get('q') ?? '';
if (input.value) void search();
