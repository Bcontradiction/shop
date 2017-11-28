$(document).ready(function(){
//点击增加按钮触发事件
    $(".plus").click(function(){
        var num = $(this).parent().children("span");
//单品数量增加
        num.text(parseInt(num.text())+1);
//商品总数增加
        var totalNum = parseInt($(".totalNum").text());
        totalNum++
        $(".totalNum").text(totalNum);
//计算总价
        var goods_price = parseInt($(this).parent().parent().children('.goods_bottom_p').children(".goods_price").text());
        $(".totalPrice").text(parseInt($(".totalPrice").text())+goods_price);
    });

//点击减少按钮触发事件
    $(".minus").click(function(){
        var num = $(this).parent().children("span");
        if(parseInt(num.text())){
            num.text(parseInt(num.text())-1);
            var totalNum = parseInt($(".totalNum").text());
            totalNum--
            $(".totalNum").text(totalNum);
            var goods_price = parseInt($(this).parent().parent().children('.goods_bottom_p').children(".goods_price").text());
            $(".totalPrice").text(parseInt($(".totalPrice").text())-goods_price);

        } else{
            num.text("0");
        }
    });
});