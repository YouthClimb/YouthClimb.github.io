// 小说目录页面 js 文件 


$(function () {

    var href = document.location.href;

    // 字符串处理，获取小说名 id 以及卷数
    href = href.substring(0, href.lastIndexOf("/"));
    const book_id = href.substring(href.lastIndexOf("/") + 1);

    $.getJSON("/json/novinfo.json", function (jsons) {
        const info = jsons.filter(json => json.book_id == book_id);

        $("#document").text(info[0].book_title);
        $("#title").text(info[0].book_title);
        $("#author").text(info[0].book_author);
        $(".header img").attr("src", info[0].path.cover);

        $.getJSON(info[0].path.json, function (jsons) {
            var v_id = 0;
            jsons.forEach((json) => {
                if (v_id != json.volume_id) {
                    $("#volumes").append("\
                    <li id=\"volume" + json.volume_id + "\"class=\"each\">\
                        <div>\
                            <div class=\"volume\">" + json.volume + "</div>\
                            <div class=\"volume-name\">" + json.volume_name + "</div>\
                        </div>\
                    </li>\
                    ");
                    v_id = json.volume_id;
                }
                $("#volume" + v_id).append("\
                <ul>\
                    <li>\
                        <a href=\"/html/novels/" + book_id + "/" + json.volume_id + "/" + json.link + "\">\
                            <div class=\"chapter\">" + json.chapter + "</div>\
                            <div class=\"chapter-name\">" + json.chapter_title + "</div>\
                        </a>\
                    </li>\
                </ul>");
            });
        });
    });
}
);