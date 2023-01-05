// 用于主页的 jQuery 文件


$(function () {
    // 点击左侧侧边栏的反馈
    $("#sidebar a").click(function (event) {
        event.preventDefault();
        // 加载页面
        let url = $(this).attr('href');
        
        $('#display-part').load("/templates/display/" + url);

    });

    // 加载默认页面
    $('#sidebar li a:nth(0)').click();
}
);
