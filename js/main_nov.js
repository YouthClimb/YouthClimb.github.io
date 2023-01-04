// 用于 novels 页面的 jQuery 文件
// 对 novels 页面进行封装，将文章信息以及内容与网页分离 


$(function () {

    var href = document.location.href;

    // 字符串处理，获取小说名 id 以及卷数
    const chapter_link = href.substring(href.lastIndexOf("/") + 1);

    href = href.substring(0, href.lastIndexOf("/"));
    const volume_id = href.substring(href.lastIndexOf("/") + 1);

    href = href.substring(0, href.lastIndexOf("/"));
    const book_id = href.substring(href.lastIndexOf("/") + 1);

    $.getJSON("/json/novinfo.json", function (jsons) {
        // 解析第一层 json 文件，获取小说的二层 json 文件
        const book_info = jsons.filter(json => json.book_id == book_id);

        const post_url = book_info[0].path.post + '/' + volume_id + '/' + chapter_link;
        const json_url = book_info[0].path.json;


        // 考虑到以后可能每部小说的信息不同，以下分书本解析小说 json 文件
        if (book_id == "lc") {
            $.getJSON(json_url, function (jsons) {
                const chapter_info = jsons.filter(json => json.volume_id == volume_id && json.link == chapter_link);

                $("#document").text(chapter_info[0].document);
                $("#book-title").text(book_info[0].book_title);
                $("#author").text(book_info[0].book_author);
                $("#volume").text(chapter_info[0].volume);
                $("#volume-name").text(chapter_info[0].volume_name);
                $("#chapter").text(chapter_info[0].chapter);
                $("#chapter-title").text(chapter_info[0].chapter_title);
                $("#paragraphs").load(post_url);
            });
        }
    });


});
