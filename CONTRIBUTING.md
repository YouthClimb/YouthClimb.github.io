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


