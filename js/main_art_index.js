


$(function () {

    $.getJSON("/json/artinfo.json", function (jsons) {
        // 获取 link 和文件名相同的 json 单元，将其添加到网页中
        jsons.forEach((json) => {
            $("#articles-list").prepend("\
            <li>\
                <a href=\"/html/articles/" + json.link + "\">\
                    <div class=\"art-title\">" + json.title + "</div>\
                    <div class=\"author\">" + json.author + "</div>\
                    <div class=\"time\">" + json.time + "</div>\
                </a>\
            </li>\
            ")
        });
    });
}
);