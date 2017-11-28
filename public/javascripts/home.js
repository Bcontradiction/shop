/**
 * Created by Administrator on 2017/11/2.
 */
$(function(){
    $('.nav-h li').mouseover(function(){
        $(this).children('span').css('color','#d01');
        if($(this).index() < 7){
            $('.select').removeClass('hide');
            $('.select').slideDown().finish();
            $('.select').find('ul').addClass('hide');
            $('.select').find('ul').eq($(this).index()).removeClass('hide');
        }
    }).mouseout(function(){
        $(this).children('span').css('color','#000');
    })
    $('.nav-h').mouseout(function(){
        $('.select').slideUp();
    })
    $('.select').find('ul').mouseover(function(){
        $('.select').slideDown().finish() //停止当前动画和动画队列
    }).mouseout(function(){
        $('.select').slideUp()
    })
})