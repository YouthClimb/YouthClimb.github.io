$(function () {


    /* ------------------ 瀑布流加载相片 ------------------- */
    var colCount;   //定义列数
    var colHeightArry = [];   //定义列高度数组
    var imgWidth = $('.img-box img').outerWidth(true);   //单张图片的宽度

    colCount = parseInt($('.img-box').width() / imgWidth);  //计算出列数
    for (var i = 0; i < colCount; i++) {
        colHeightArry[i] = 0;
    }
    //[0,0,0]

    $('.img-box img').on('load', function () {

        var minValue = colHeightArry[0];  //定义最小的高度
        var minIndex = 0;  //定义最小高度的下标
        for (var i = 0; i < colCount; i++) {
            if (colHeightArry[i] < minValue) {   //如果最小高度组数中的值小于最小值
                minValue = colHeightArry[i];   //那么认为最小高度数组中的值是真正的最小值
                minIndex = i;  //最小下标为当前下标
            }
        }

        $(this).css({
            left: minIndex * imgWidth,
            top: minValue
        });
        colHeightArry[minIndex] += $(this).outerHeight(true);
    });


    //当窗口大小重置之后，重新执行
    $(window).on('resize', function () {
        reset();
    });


    //当窗口加载完毕，执行瀑布流
    $(window).on('load', function () {
        reset();
    });

    //定义reset函数
    function reset() {
        var colHeightArry = [];
        colCount = parseInt($('.img-box').width() / imgWidth);
        for (var i = 0; i < colCount; i++) {
            colHeightArry[i] = 0;
        }
        $('.img-box img').each(function () {
            var minValue = colHeightArry[0];
            var minIndex = 0;
            for (var i = 0; i < colCount; i++) {
                if (colHeightArry[i] < minValue) {
                    minValue = colHeightArry[i];
                    minIndex = i;
                }
            }

            $(this).css({
                left: minIndex * imgWidth,
                top: minValue
            })
            colHeightArry[minIndex] += $(this).outerHeight(true);
        });
    }
    /* -------------------------------------------- */


    /* ---------------- 展示图片界面交互 -------------- */
    $('.img-box img').on('click', function () {
        $("#img-displayer img").attr("src", $(this).attr("src"));
        $("#img-displayer").css("display", "block");
    });

    $('#img-displayer #close-d').on('click', function () {
        $("#img-displayer").css("display", "none");
        $("#img-displayer img").attr("src", "");
    });
    /* -------------------------------------------- */

});