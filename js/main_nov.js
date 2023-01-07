// 用于 novels 页面的 jQuery 文件
// 对 novels 页面进行封装，将文章信息以及内容与网页分离 


$(function () {
    /* ------------------- json 解析 -------------------- */
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



        $.getJSON(json_url, function (jsons) {
            /* 解析第二层 json 文件，获取每一章详情并写入网页 */
            var chapter_info;

            jsons.forEach(json => {
                if (json.volume_id == volume_id && json.link == chapter_link)
                    chapter_info = json;
            });

            $("#document").text(chapter_info.document);
            $("#book-title").text(book_info.book_title);
            $("#author").text(book_info.book_author);
            $("#volume").text(chapter_info.volume);
            $("#volume-name").text(chapter_info.volume_name);
            $("#chapter").text(chapter_info.chapter);
            $("#chapter-title").text(chapter_info.chapter_title);

            $("#paragraphs").load(post_url, function () {
                // 必须在此处获取载入后界面的高度
                height = $(document).height(); //页面高度
            });
            /* -------------------------------------- */


            // 获取当前章节前一章和后一章的地址
            var last_info, next_info;

            jsons.forEach(json => {

                if (json.id == parseInt(chapter_info.id) + 1) {
                    next_info = json;
                }

                if (json.id == parseInt(chapter_info.id) - 1)
                    last_info = json;
            });

            if (last_info)
                $(".last-chapter a").attr("href", "/html/novels/" + book_id + "/" + last_info.volume_id + "/" + last_info.link);
            if (next_info)
                $(".next-chapter a").attr("href", "/html/novels/" + book_id + "/" + next_info.volume_id + "/" + next_info.link);
            /* -------------------------------------- */
        });

    });
    /* ------------------------------------------------ */


    /* ------------------- 回到顶部/底部按钮 -------------------- */
    var height;
    //点击回到顶部
    $('.totop').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 'fast');
        return false;
    });

    //回到底部
    $('.tobottom').click(function () {
        $('html,body').stop();
        $('html,body').animate({
            scrollTop: height
        }, 'fast');
        return false;
    });
    /* ------------------------------------------------ */
});
