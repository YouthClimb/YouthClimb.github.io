# 如何对项目做出贡献
本文档将对如何开发与维护此项目做出详细介绍，将包括但不限于以下内容：
1. 项目开发所需要的知识
2. 项目目录结构
3. 如何维护项目
4. 如何继续开发项目
5. ...

_JYCao 编辑于 2023.1.8_
## 一、项目开发所需要的知识
请参考根目录下的 [study.md](/study.md) 文件

## 二、项目目录结构
此项目有以下文件夹,接下来将对每个文件夹的用途做出简要介绍，详细介绍会在之后描述如何维护项目中提出。
```
C:.
├─.github
│  ...
├─css
│  ...
├─font
│  ...
├─html
│  ...
├─image
│  ...
├─js
│  ...
├─json
│  ...
├─less
│  ...
├─posts
│  ...
└─templates
   ...
```

### 根目录下的文件
根目录下主要有几类文件:`.gitignore`、`index.html`、`favicon.ico`以及若干后缀为`.md`的文件。

`.gitignore`: Git 的忽略文件，包含在其中的文件名在进行 Git 操作时会被忽略，而不会出现在记录中。

`index.html`: 网站的主页 Html 文件。这是一般进入网站后第一个会显示的页面。

`favicon.ico`: 网站的导航栏图标文件。

`.md`: 描述性的文档。用于介绍项目，描述如何成为开发者或是描述其他一些相关信息。

### .github
此文件夹用于存放项目上传到 Github 网站后的一些报告模板。

### css less js json
如同名字，css 和 less 文件夹分别用于存放 css 和 less 文件。js 和json 用于存放 JavaScript 和 json 文件。

### image 
也如同名字，image 文件夹用于存放项目用的图片。

需要注意的是，image 中针对不同用途创建了不同的文件夹
```
image
├─contributing
├─diaotu
├─nov_cover
├─photos
└─...

```
比如 `contributing` 是 `CONTRIBUTING.md`（此文档）中所用的图片；`diaotu`、`photos`分别是网站展示的照片和弔图；`nov_cover`则是小说封面。

### font
这是用于存放网站用字体的文件夹，其中的 `awefonts` 子文件夹是项目引用的一个名为 fonts awesome 的图标字体库。

这里做出提醒，其中的 `css` 和 `webfonts` 尽量别分开，如果分开再想使用得做出修改。包括其他的图标字体库也是如此。

### html templates posts
这几个都是用于存放 html 文件的文件夹，其结构稍微有些复杂，下面做出解释。

`html`文件夹用于存放各页面的完整页面（含有 html、head 和 body标签）。其中的 html 文件，重复部分被剥离，分别放至`templates`和`posts`文件夹。

`templates`文件夹中用于存放可复用的页面 html 元素，比如存在于所有页面的顶部导航条，还有网页的底部等，在 `templates`中有一个名为`display`的子文件夹，其中存放了网站主页点击左侧导航栏切换的右侧页面。

`posts`文件夹用于存放小说和文章中的文段内容。

## 如何对项目进行维护
目前为止项目主要可以划分成几块: html 构建的页面层次，css 和 less 负责的页面渲染，js 负责的网页行为，以及依靠 js 对 json 进行解析后将各个模块拼凑在一起的模块化。

_提示：维护时利用 Live Server 插件，在想要预览的界面 html 编辑界面右键，点击`Open with Live Server`，所进行的更改都会实时（保存后）反馈在页面中。_
### css 与 less
在对其他部分进行说明前，我先对 css/less 这一渲染部分做出讲解，因为它与其他部分的联系相对不是很紧密。

所有的 css 文件都存放于`/css`目录下。在这些 css 文件中，你可能会注意到，几乎所有文件后缀都为`.min.css`，带有 min 的文件都是经过压缩只剩一行的文件（压缩后文件变小，浏览器加载速度更快）。

其中，`reset.min.css`是所有页面都必须引入的 css 样式表，它用于初始化页面样式。然后则是对剩下几个文件的解释：

`index.min.css`: 用于 _主页_ 的样式表。
`article.min.css`: 用于含 _文段内容的文章页面_ 样式表。
`article_index.min.css`: 用于 _文章列表页面_ 的样式表。
`novel.min.css`: 用于 _含小说内容的小说页面_ 样式表。
`novel_index.min.css`: 用于 _小说列表页面_ 的样式表。
`novel_catalog.min.css`: 用于 _小说目录页面_ 的样式表。
`image.min.css`: 用于 _图片展示页面_ 的样式表。

***

接下来是`less`，所有的 less 文件都存在于`/less`文件夹。项目中所有的 css 文件都是由 less 文件生成，所以在编写样式表的时候，我们只需要对 less 进行编辑，将注释写进 less 中而非 css 中。这样有助于项目的维护。

>如果你按照流程安装了 Easy LESS 插件，并进行了配置之后，每当你进行一次保存，在 less 目录都会自动编译生成一个同名的 css 文件<br>
>安装 JS & CSS Minifier(Minify) 插件，在想要压缩的 css 文件编辑界面按`CTRL+Shift+p`，然后在顶部输入`Minify: Document`并确定，就会生成一个同名的`.min.css`文件，将其重命名后放入 css，整个修改流程就完成了。<br>
>如果想要进行调试，可以直接在 `/css` 路径下的相应被引入的样式表中写 css，这样页面中会同步反馈，更加方便。等写完后再将代码剪切到相应 less 文件中进行修改，然后生成新的`.min.css`即可。<br>
>这里如果有疑惑，可以参考根目录下的[study.md](/study.md)文件，以及对相关内容进行百度。

其中，以 _main_ 开头的文件为主要文件，其中对于需要的 less 文件用`@import`进行链接，前三个文件为所有页面都必须包含的 less 文件，最后一个则是独立的。

以 _下划线_ 开头的 less 文件是被用于链接的模块，其中`_color.less` `_vars.less` `_basic.less` 是每个 _main_ less 文件所必要的链接模块。接下来对每个文件进行解释。

_下划线_ 开头的 less 文件：
`_color.less`: 存放所有颜色变量
`_vars.less`: 存放跨文件使用多次的变量
`_basic.less`: 对于头部导航条和网页底部等所有页面都在使用的公共 html 元素进行渲染的 less 文件模块。
`_index.less`: 对主页特有元素进行渲染的 less 文件模块。
`_article.less`: 对带文本的文章页面特有元素进行渲染的 less 文件模块。
`_article_index.less`: 对文章列表页面特有元素进行渲染的 less 文件模块。
`_novel.less`: 对带文本的小说页面特有元素进行渲染的 less 文件模块。
`_novel_index.less`: 对小说列表页面特有元素进行渲染的 less 文件模块。
`_novel_catalog.less`: 对小说目录页面特有元素进行渲染的 less 文件模块。
`_img`: 对图片展示页面特有元素进行渲染的 less 文件模块。

_main_ 开头的 less 文件，都是仅对于以上文件的其中若干个形成链接的文件：
`main.less`: 主页的 less 文件。
`main_art.less`: 含文段文章页面的 less 文件。
`main_art_index.less`: 文章列表页面的 less 文件。
`main_nov.less`: 含文段小说页面的 less 文件。
`main_nov_index.less`: 小说列表页面的 less 文件。
`main_nov_catalog.less`: 小说目录页面的 less 文件。
`main_img.less`: 图片展示页面的 less 文件。

### 主页

#### 模块化操作
在这里我将对整个项目目前所用的模块化思路进行详细说明，之后遇到类似的模块化思路就不再重点介绍。

一个完整网页的 html 代码可能如下所示，这里用主页的文件`index.html`作为模板示例：
```
<!DOCTYPE html>
<html lang="...">

<head>
    <meta ...>
    ...

    <!-- 引入样式表 -->
    <link rel="stylesheet" href="...">
    ...

    <!-- 链接 JS 文件 -->
    <script src="..."></script>
    ...

    <title>导航栏标题</title>
</head>

<body>
    <!-- 头部导航条容器 -->
    <nav id="topbar-warpper" class="">
        ...
    </nav>

    <!-- 网页头部 -->
    <header class="">
        <div class="">标题</div>
    </header>

    <!-- 网页主体部分 -->
    <main class="">
        <!-- 侧边（左侧）导航条容器 -->
        <nav class="sidebar-warpper">
            <div id="sidebar" class="sidebar">
                <h1>导航</h1>
                <ul>
                    <li><a href="...">...</a></li>
                    ...
                </ul>
            </div>
        </nav>

        <!-- 右边内容展示部分 -->
        <div class="display-warpper">
            <div id="display-part" class="display-part">
                ...
            </div>
        </div>
    </main>

    <!-- 网页底部 -->
    <footer class="footer-warpper">
        ...
    </footer>
</body>

</html>
```
这个网页有五个部分，分别是
1. head 标签，对于网页的一堆设置和文件引用。
2. body 标签，顶部导航条
3. body 标签，左侧导航栏
4. body 标签，右侧内容展示
5. body 标签，网页底部

其中有三个部分(head 中共有的样式表与 js 文件, 头部导航条 以及 网页底部)在整个项目的所有页面中都用得到，如果每个页面都进行复制粘贴，需要修改的时候就必须挨个文件挨个文件来改，十分不方便。所以，我们可以写一个 js 文件来分离这些公共部分。

于是，页面代码可以写成如下形式。
```
<!DOCTYPE html>
<html lang="...">

<head>
    <template id="head">
        <!-- js 引入 -->
    </template>

    <!-- 引入私有样式表 -->
    <link rel="stylesheet" href="...">
    ...

    <!-- 链接私有 JS 文件 -->
    <script src="..."></script>
    ...

    <title>导航栏标题</title>
</head>

<body>
    <!-- 头部导航条容器 -->
    <nav id="topbar-warpper" class="">
        <!-- js 引入 -->
    </nav>

    <!-- 网页头部 -->
    <header class="">
        <div class="">标题</div>
    </header>

    <!-- 网页主体部分 -->
    <main class="">
        <!-- 侧边（左侧）导航条容器 -->
        <nav class="sidebar-warpper">
            <div id="sidebar" class="sidebar">
                <h1>导航</h1>
                <ul>
                    <li><a href="...">...</a></li>
                    ...
                </ul>
            </div>
        </nav>

        <!-- 右边内容展示部分 -->
        <div class="display-warpper">
            <div id="display-part" class="display-part">
                ...
            </div>
        </div>
    </main>

    <!-- 网页底部 -->
    <footer class="footer-warpper">
        <!-- js 引入 -->
    </footer>
</body>

</html>
```

项目中使用`/js/main.js`这一 js 文件来处理这一模块化操作，因此，该文件也是必须被所有页面包含的 js 文件之一。被分离出来的部分代码则被放在了`/templates`目录下的`head.html`、`topbar.html`以及`footer.html`中。

#### 动态页面加载
接下来是对主页特有的 _左侧导航栏_ 以及 _右侧展示部分_ 进行描述。

左侧导航栏分别有近期发布、小说、文章、图片和成员五个超链接，点击后页面右侧会出现相关内容。_近期发布_ 会展示一些文章，主要是每月中旬的更新详情；_小说_ 展示了一部分小说内容及其简介；_文章_ 展示了一些精选文章；_图片_ 则是可以跳转到照片或弔图网页；而 _成员_ 则是对于 C&P 成员进行介绍。

关于动态加载，点击左侧导航栏的对应超链接，可以不刷新页面地对右侧内容进行相应更换。

思路很简单：
1. 在左侧超链接的 href 属性中存放相应的文件名称
2. 将相应文件模块化后放在`/templates/display`路径下
3. 用`/js/main_index.js`对页面进行动态加载，点击对应超链接后提取 href 属性的值，加上路径名`/templates/display`后载入
4. 默认加载 _近期发布_ 内容。

## 文章
与文章相关的页面一共有两个（种）：`/html/articles/index.html`是文章列表页面，上面展示所有文章；然后是带有文段的文章页面，目前仅有一篇文章: `/html/articles/i1_welcome.html`。

>文章文件命名规则：i[期]_[任意名称].html
>其中，[期]为文章发布期数，每个月中旬为一期，从2023.1.15期为第一期

文章列表页面和文段展示页面分别由`/js/main_art_index.js`和`/js/main_art.js`处理。

### 模块化

关于文章两个页面的模块化比主页稍稍复杂一些，毫无疑问，他们也将前述的三个公共部分分离了。文章的文段内容则被分离到了`/posts/articles`目录下，文件名与网页名同名（如`/posts/articles/i1_welcome.html`的对应页面为`/html/articles/i1_welcome.html`）。

>（这里可以不用认真看）
>原本我的打算是只用一个文章的模板网页，以及多个 posts。每次展示一个页面时，用模板加上 posts 组合生成新页面。
>然而我发现了一个问题，当打开新页面时，之前的 js 文件无法发挥作用，这样就不知道新页面该引用哪一篇文章。无奈之下，只好把模板网页的名字当作引用线索，每写一篇文章就得创建一个新的模板。好在不用进行任何修改。

模块化文章页面，我选择了利用 js 文件对 json 文件进行解析。以下是文章的 json 文件`/json/novinfo.json`目前的源代码：
```
[
    {
        "link": "i1_welcome.html",
        "document": "Welcome to YouthClimb",
        "title": "欢迎来到 YouthClimb",
        "author": "YouthClimb",
        "time": "2023.1.1",
        "editor": "JYCao"
    }
]
```
`link`字段是文章的文件名，`document`字段是文章导航栏标题，`title`字段是文章题目，`author`字段是文章作者，`time`字段是文章创作时间，而`editor`字段是文章的编辑人。

有这样一个 json 文件，js 可以对 json 进行解析，从而获得文章的信息，将其载入到需要相关信息的位置。至于如何解析 json，可以自行进行研究，难度不高。

如果仅是想要添加文章，需要
1. 在`/html/articles`复制粘贴一个模板文件并重命名；
2. 把文章文段内容的文件放入`/posts/articles`中，改为和网页相同的名字；
3. 在 json 中增添相应信息保存即可。

## 小说
小说比起文章略显复杂，相关页面一共有三个（种）：`/html/novels/index.html`是小说列表页面，上面展示所有的小说；然后是特定小说的目录页面，如`/html/novels/lc/index.html`；最后是小说的文段页面，如`/html/novels/lc/1/1.html`。

因为小说的独特性，除了小说列表页面只有一个 html 文件之外，小说目录 html 文件和小说的数量相同，小说的文段页面 html 文件和小说数量的章节数相同。相应的，每个小说都要建立一个独立文件夹。

json 文件用了两个种，`/json/novinfo.json`用于存放每部小说的相关信息，以及相关的 html, js 以及每部小说独立的 json 文件；

`book_id`为每部小说独特的标识字符串，也是文件夹名称。`book_title`和`book_author`就不多解释了。`path`字段的四个子字段，依次表示相应小说的 json 路径，文段存放路径，封面图片路径 以及 小说目录路径。
```
[
    {
        "book_id": "lc",
        "book_title": "御光师",
        "book_author": "JYCao",
        "path": {
            "json": "/json/novels/lc.json",
            "post": "/posts/novels/lc",
            "cover": "/image/nov_cover/none.png",
            "html": "/html/novels/lc/index.html"
        } 
    },
    ...
]
```
另一种是用于存放各个小说的卷数章数以及标题等信息，每一部小说都有一个自己的 json，放在`/json/novels`下。这里以`/json/novels/lc.json`为例。
```
[
    ...
    {
        "id": "2",
        "link": "1.html",
        "document": "御光师 第一卷 第一章",
        "volume": "第一卷",
        "volume_name": "自彼界而来的魔法使",
        "volume_id": "1",
        "chapter": "第一章",
        "chapter_title": "摘不下的戒指"
    },
    ...
]
```
`id`标识了章节在小说中处于第几章，实际上，这个字段主要用于`/js/main_nov.js`的“上一章”“下一章”跳跃功能实现；`link`是文件名，用于作为引入文段的线索；其他的不多解释。
