# 如何对项目做出贡献
## 一、项目开发所需要的知识
### I.你需要学
1. Html, CSS, JavaScript 前端三件套
2. Git 与 Github 的使用
3. less: 用于简化 css 的编写
4. jQuery 和 json 的相关知识

### II.简介及教学
#### i. Html, CSS, JavaScript 前端三件套
Html, CSS, JavaScript 是用于网站 _前端_ 开发的三件套。

什么是前端？网站分为 _前端_ 和 _后端_ ，简单来说就是，_前端_ 负责管网页的表现: 它的样式、动画和用户点击后的交互等；而 _后端_ 则管理网站数据的存储，数据的处理还有表单的提交等。

幸运的是，搭载于 Github 的 YouthClimb 属于静态网站，所以不需要学习后端内容。

Html 相当于是网页的骨架，它使用各种标签标识出了网页的结构：标题，文段或是图片等。CSS 则是网页的皮肤、衣服，它赋予了页面各种样式和颜色，使其多姿多彩。JS 则是网页的肌肉，它使得网页能够出现各种动态特效和行为，使其能够和用户产生交互。

更加详细的就不加赘述，这里放出几个教程网站的链接:

[菜鸟教程](https://www.runoob.com/)

[W3School在线教程](https://www.w3school.com.cn/)

[尚硅谷 Web 前端零基础入门 HTML5+CSS3 基础教程](https://www.bilibili.com/video/BV1XJ411X7Ud/?spm_id_from=333.999.0.0&vd_source=0f675bd8d9f836748979b9492a924e4f)

其中，菜鸟教程和 W3School 都含有三件套的教程及手册，他们还可以在线编辑运行，实时动手操作。是不错的教学网站。尚硅谷的B站课程讲得清晰易懂，基本每个概念和操作都有解释，缺点就是看这个课程学习速度较慢，不过零基础看一看也是可以的。

顺带一提，如果在学习三件套之初不知道将代码写在何处编译运行，可以先跟着尚硅谷的课程走一段时间，知道熟悉了开发环境再切换到其他教程学习。

#### ii. Git 与 Github 的使用
Git 是一个命令行工具，它能帮助我们管理项目，记录项目在某时刻的状态，并且创建分支，实现并行开发。

前面的概念可能有些让人难以理解。简单来说，Git 能够保存项目，在项目文件改变后，能够回溯到项目中文件之前的状态；它也能在你在开发某项功能时，去开发另一项功能而互不影响。

这只是一部分好处，Git 最大的好处就是，能够实现多人合作开发。Git 能够将你保存的文件状态和分支上传到远程仓库，其他人能够利用 Git 将你上传的东西下载下来，这样非常方便省事。

而这里提到的远程仓库，我们选择使用 Github。Github 是一个代码托管平台，它能够存储你上传的项目代码，还有上传的文件状态与分支。最重要的是，Github 给每一个账号提供了一个免费的静态网站，这是选 Github 作为远程仓库的重要原因之一。

对于 Git 和 Github 的使用，我写了一个文档用于入门。文档上包含了它的 _下载、配置_ 以及 _使用_ 教程。下面是链接:

https://github.com/YouthClimb/UseOfGit

没错，这个文档是上传于 Github 的。在看文档学习时，如果你觉得写的有些难懂，也可以去看此仓库中上传的 pdf 文件，那是一个专门的 Git 教程，文档是这本教程的简化。

![仓库中的pdf教程文件](/image/contributing/%E4%BB%93%E5%BA%93%E4%B8%AD%E7%9A%84pdf%E6%95%99%E7%A8%8B%E6%96%87%E4%BB%B6.png)

参考链接: [Git 的使用(百度)](https://www.baidu.com/s?ie=UTF-8&wd=git%E7%9A%84%E4%BD%BF%E7%94%A8)

在百度时建议优先看 csdn 和博客等网站的文章。

#### iii. less: 用于简化 css 的编写
Less 是 Leaner Style Sheets 的缩写。它是一门 CSS 的扩展语言，可以写出更加优美的语法和更易于维护的格式。实际上，less 和 CSS 是及其相似的，如果你学过 CSS，上手 less 只需要不到一个小时的时间。

安装教程链接：

[less 的安装、使用步骤](https://blog.csdn.net/xulihua_75/article/details/125260201)

这是一篇写的较为详细的 csdn 文章，教你如何安装 less 以及在 vscode 上配置 easy less 插件。easy less 插件可以在你保存 less 文件时自动编译生成 CSS 文件。

这里提醒一下，安装教程只需要看第一部分，下面的用不到。

安装完成后，可以参考以下链接进行学习。

less 官方文档教程链接:

[less 官方文档](https://less.bootcss.com/)

#### iv. jQuery 和 json 的相关知识
jQuery 是一个快速、简洁的 JavaScript 框架。它封装 JavaScript 常用的功能代码，提供一种简便的 JavaScript 设计模式，优化 HTML 文档操作、事件处理、动画设计和 Ajax 交互。

简单来说，实际上 jQuery 就是一个 JS 文件（可以理解成，jQuery 就是 JS），它是一个库。在引入它后，你就可以用 jQuery 的语法写出更加简洁的 JS 语句。实际上，你甚至不需要把 JS 学完，直接学习 jQuery 也能直接上手目前的项目模式开发。

jQuery 教程网站链接:

[菜鸟教程 jQuery](https://www.runoob.com/jquery/jquery-tutorial.html)

[W3School jQuery](https://www.w3school.com.cn/jquery/index.asp)

***

json 是一种文件格式，它可以储存若干的键值对，它能将各种信息关联起来。它必须按照一定的格式进行编写，所以易于解析。在项目中，利用 JS 对 json 文件进行解析，然后可以进行模块化。

[菜鸟教程 json](https://www.runoob.com/json/json-tutorial.html)

[W3School json](https://www.w3school.com.cn/js/js_json_intro.asp)

这一块如果感觉还是难以理解，可以去看看百度上的 csdn 文章。

## 二、环境配置
对于开发环境，这里给出建议。如果没有安装开发环境的，最好是跟着这里来。

### I.编辑器
首选使用 vscode 进行开发。vscode 有很多好处，首先，它是轻量级编辑器，启动速度快，反应很快。其次它可以安装很多插件，这样可以省去很多开发过程中遇到的麻烦。再次，它可以在下方开启终端，这样输入命令行就不需要专门打开一个黑窗口。最后，它还能进行美化，让开发过程更加舒心。

vscode 的安装教程:
[手把手教你安装 vscode](https://blog.csdn.net/m0_55400356/article/details/126026733)

这个教程做到第三部，安装完汉化后就可以不看了，下面的插件我们不一定用得到。

安装插件点击 vscode 左侧四个方块的图标。接下来给出一些必要的插件：

汉化插件：

1. Chinese(Simplified): vscode 汉化

语言格式相关插件：

2. HTML CSS Support: HTML CSS 语法高亮以及格式提示
3. Beautify css/sass/scss/less: 用于提醒和美化 less 和 css 格式

工具型插件：

4. Easy LESS: 自动编译 less 文件
5. JS & CSS Minified: 压缩 JS CSS 文件
6. Live Server: 构建本地服务器可以实现网站的本地测试
7. Git History 和 GitLens —— Git supercharged: Git 相关插件

美化（不是必须, 建议之后有余力再研究）：

8. background: 给 vscode 添加背景
9. vscode-icons: 改变左侧文件图标样式
10. Ayu: 改变 vscode 主题
11. Tabnine AI Autocomplete for Javascript, Python, Typescript, PHP, Go, Java, Ruby & more: 有趣的 AI 补全代码，图一乐

### II.vscode 配置终端
在 vscode 的底部可以使用命令行，这样就不需要从外部打开一个项目目录的黑窗口了。按快捷键 `CTRL + SHIFT + ~` 可以打开下方的终端。或是点击 vscode 顶部导航栏的 _终端_ ，再点击新建终端即可。

接着配置终端，从顶部导航栏点击 `文件`，选择 `首选项`，再选择 `设置` 进入设置界面，然后点击右上方的 `打开设置(json)`。

![终端设置1](/image/contributing/%E7%BB%88%E7%AB%AF%E8%AE%BE%E7%BD%AE1.png)

这时会弹出一个名为 `settings.json` 的文件。找到 `"terminal.integrated.profiles.windows"` 字段，它可能是这样的（这是我的配置，仅供参考，建议不要复制粘贴）。

```
"terminal.integrated.profiles.windows": {
    "PowerShell": {
        "source": "PowerShell",
        "icon": "terminal-powershell"
    },
    "Command Prompt": {
        "path": [
            "${env:windir}\\Sysnative\\cmd.exe",
            "${env:windir}\\System32\\cmd.exe"
        ],
        "args": [],
        "icon": "terminal-cmd"
    },
    "Git-Bash": {
        // "path": "D:\\Git\\usr\\bin\\bash.exe",
        "path": "C:\\dev\\msys64\\msys2_shell.cmd",
        "args": [
            "-defterm",
            "-mingw64",
            "-no-start",
            "-here",
            "-lic",
            "cd $PWD; exec zsh"
        ]
        //"source": "GitBash"
    },
},
```

在`"terminal.integrated.profiles.windows"`的大括号中，添加
```
"Git-Bash": {
        "path": "D:\\Git\\usr\\bin\\bash.exe",
        "source": "GitBash"
    },
```

如果有 `"Git-Bash"` ，就直接在其中修改。`"path"`是你安装的 Git 中 Git Bash 路径。注意，需要的 `bash.exe` 是 `bin` 下的。

然后，修改`"terminal.integrated.defaultProfile.windows"`字段（有则修改无则添加）为
```
"terminal.integrated.defaultProfile.windows": "Git-Bash",
```

如果觉得这里描述不够清楚，可以百度搜索 "vscode 配置 git bash"或是"vscode 配置终端"等字样。下面是参考文章。

参考文章: [vscode配置gitbash](https://www.imooc.com/article/321909)
