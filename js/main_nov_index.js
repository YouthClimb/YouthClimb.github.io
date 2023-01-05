// 小说列表页面 js 文件 


$(function () {

    $.getJSON("/json/novinfo.json", function (jsons) {
        // 获取 link 和文件名相同的 json 单元，将其添加到网页中
        jsons.forEach((json) => {
            console.log(json.path.cover);
            $("#novels-list").append("\
            <li>\
                <a href=\"/html/novels/lc/1/prologue.html\">\
                <img src=\"" + json.path.cover + "\" alt=\"cover\"> </div>\
                    <div class=\"book-title\">" + json.book_title + "</div>\
                    <div class=\"author\">" + json.book_author + "</div>\
                </a>\
            </li>\
            ")
        });
    });
}
);
