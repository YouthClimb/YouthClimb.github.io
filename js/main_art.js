// 用于 articles 页面的 jQuery 文件
// 对 articles 页面进行封装，将文章信息以及内容与网页分离 

// 主要为 JSON 解析，对 /json/artinfo.json 解析之后将信息放入 article 页面中
$(function () {

    // 取当前页面的名称，与 “link” 进行比对，如果符合，将相关信息放入网页

    // 字符串处理
    var href = document.location.href;
    href = href.substring(href.lastIndexOf("/") + 1);

    $.getJSON("/json/artinfo.json", function (jsons) {

        // 获取 link 和文件名相同的 json 单元，将其添加到网页中
        const info = jsons.filter(json => json.link == href);

        $("#document").text(info[0].document);
        $("#title").text(info[0].title);
        $("#author").text("作者：" + info[0].author);
        $("#time").text("时间：" + info[0].time);
        $("#editor").text("编辑：" + info[0].editor);

        $("#paragraphs").load("/posts/articles/" + href);
        
    });
}
);
