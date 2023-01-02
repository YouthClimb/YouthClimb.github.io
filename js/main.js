// 所有网页通用 jQuery 文件


$(function() {

    // 加载网页 head 部分内容
    $("#head").load("/templates/head.html");
    // 加载网页顶部导航条
    $("#topbar-warpper").load("/templates/topbar.html");
    // 加载网页底部
    $("footer").load("/templates/footer.html");
}
);
