# 如何对项目做出贡献
本文档将对如何开发与维护此项目做出详细介绍，将包括但不限于以下内容：
1. 项目开发所需要的知识
2. 项目目录结构
3. 如何维护项目
4. 如何继续开发项目
5. ...

_编辑于 2023.1.8_
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


