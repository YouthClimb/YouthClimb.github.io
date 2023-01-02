// 用于 articles 页面的 jQuery 文件
// 对 articles 页面进行封装，将文章信息以及内容与网页分离 

// 主要为 JSON 解析，对 /json/artinfo.json 解析之后将信息放入 article 页面中
$(function () {

    // 取当前页面的名称，与 “link” 进行比对，如果符合，将相关信息放入网页

    // 字符串处理
    var href = document.location.href;
    href = href.substring(href.lastIndexOf("/") + 1);

    $.getJSON("/json/artinfo.json", function (jsons) {
        // 循环比对，满足条件执行操作
        for (var json of jsons) {
            if (href == json.link) {
                {
                    $("#document").text(json.document);
                    $("#title").text(json.title);
                    $("#author").text("作者：" + json.author);
                    $("#time").text("时间：" + json.time);
                    $("#editor").text("编辑：" + json.editor);

                    $("#paragraphs").load("/posts/articles/" + href);

                    break;
                }
            }

        }
    });
}
);
