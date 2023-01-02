// 用于主页的 jQuery 文件


$(function () {
    // 点击右侧展示部分超链接后的反馈
    $(".display-part a").click(function () {

        let url = $(this).attr("href");

        // 超链接为文章的情况
        if ($(this).hasClass("articles")) {
            $(this).attr('href', '../html/articles/' + url);
        }
    });
}
);
