/**
 * Created by Administrator on 2017/9/22.
 */
$(function() {
    //导航栏
    $(".linkstart_nav li").click(function(e) {
        // make sure we cannot click the slider
        if ($(this).hasClass('slider')) {
            return;
        }

        /* Add the slider movement */

        // what tab was pressed
        var whatTab = $(this).index();

        // Work out how far the slider needs to go
        var howFar = 160 * whatTab;

        $(".slider").css({
            left: howFar + "px"
        });

        /* Add the ripple */

        // Remove olds ones
        $(".ripple").remove();

        // Setup
        var posX = $(this).offset().left,
            posY = $(this).offset().top,
            buttonWidth = $(this).width(),
            buttonHeight = $(this).height();

        // Add the element
        $(this).prepend("<span class='ripple'></span>");

        // Make it round!
        if (buttonWidth >= buttonHeight) {
            buttonHeight = buttonWidth;
        } else {
            buttonWidth = buttonHeight;
        }

        // Get the center of the element
        var x = e.pageX - posX - buttonWidth / 2;
        var y = e.pageY - posY - buttonHeight / 2;

        // Add the ripples CSS and start the animation
        $(".ripple").css({
            width: buttonWidth,
            height: buttonHeight,
            top: y + 'px',
            left: x + 'px'
        }).addClass("rippleEffect");
    });
    //首页索引
    $('.btn-6')
        .on('mouseenter', function(e) {
            var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
            $(this).find('span').css({top:relY, left:relX})
        })
        .on('mouseout', function(e) {
            var parentOffset = $(this).offset(),
                relX = e.pageX - parentOffset.left,
                relY = e.pageY - parentOffset.top;
            $(this).find('span').css({top:relY, left:relX})
        });
    // $('[href=#]').click(function(){return false});
    $('#register-sub form').on('submit', function (e) {
        e.preventDefault()

    })
    //登录
    var working = false;
    $('.login').on('submit', function(e) {
        e.preventDefault();
        if (working) return;
        working = true;
        var $this = $(this),
            $state = $this.find('button > .state');
        $this.addClass('loading');
        $state.html('Authenticating');
        setTimeout(function() {
            $this.addClass('ok');
            $state.html('Welcome back!');
            setTimeout(function() {
                $state.html('Log in');
                $this.removeClass('ok loading');
                working = false;
            }, 4000);
        }, 3000);
    });

    $('#resetData').click(function(){
        $(":input","#search-form")
            .not(":button",":reset","hidden","submit")
            .val("")
            .removeAttr("checked")
            .removeAttr("selected");
        $('#search-form')[0].reset();
        $('form input').value('');
    })

    //user-list表中设置默认
    $('.click-url-default').click(function(event){
        event.preventDefault();
        let id = $(this).attr('target')
        // console.log(id);
        $.ajax({
            type:'POST',
            url:`/address/${id}/default`,
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).done(data=>{
            console.log(data)
            $('.alert-default-url').removeClass('hide')
            setTimeout(function(){
                $('.alert-default-url').addClass('hide')
            },1500)
            // alert(data.message);
        }).catch(err=>{
            console.log(err)
        })
    })
    $('.click-shop-buy a').click(function(event){
        event.preventDefault();
    })
    //商品详细列表的收藏和点赞
    //收藏
    $('.click-shop-collect').click(function(event){
        var id = $(this).attr('target')
        // console.log(id)
        $.ajax({
            method:'POST',
            url:`/shop/${id}/collect`,
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).done(function(data){
            if(data.success == true){
                $('.alert-collect').removeClass('hide');
                $('.click-shop-collect').addClass('hide')
                $('.click-shop-collect-active').removeClass('hide')
                setTimeout(function(){
                    $('.alert-collect').addClass('hide');
                },2000)
                // $('.click-shop-collect').addClass('gray-small')
            }/*else {
                $('.alert-uncollect').removeClass('hide');
                setTimeout(function(){
                    $('.alert-uncollect').addClass('hide');
                },2000)
                $('.click-shop-collect').addClass('gray-small')
            }*/
            console.log(data)
        }).fail(function(err){
            console.log(err)
        })
    })
    //删除收藏
    $('.click-shop-collect-active').click(function(event){
        var id = $(this).attr('target')
        // console.log(id)
        $.ajax({
            method:'POST',
            url:`/shop/${id}/uncollect`,
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).done(function(data){
            if(data.success == false){
                $('.click-shop-collect-active').addClass('hide')
                $('.click-shop-collect').removeClass('hide')
                $('.alert-uncollect').removeClass('hide');
                setTimeout(function(){
                    $('.alert-uncollect').addClass('hide');
                },2000)
                // $('.click-shop-collect').addClass('gray-small')
            }/*else {
                $('.alert-uncollect').removeClass('hide');
                setTimeout(function(){
                    $('.alert-uncollect').addClass('hide');
                },2000)
                $('.click-shop-collect').addClass('gray-small')
            }*/
            console.log(data)
        }).fail(function(err){
            console.log(err)
        })
    })
    $('.click-shop-satisfaction').click(function(event){
        var id = $(this).attr('target')
        // console.log(id)
        $.ajax({
            method:'POST',
            url:`/shop/${id}/satisfaction`,
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).done(function(data){
            if(data.success == true){
                $('.alert-likes').removeClass('hide');
                $('.click-shop-satisfaction').addClass('hide')
                $('.click-shop-satisfaction-active').removeClass('hide')
                setTimeout(function(){
                    $('.alert-likes').addClass('hide');
                },2000)
                // $('.click-shop-satisfaction').removeClass('gray-small')
            }
            console.log(data)
        }).fail(function(err){
            console.log(err)
        })
    })
    //取消点赞
    $('.click-shop-satisfaction-active').click(function(event){
        var id = $(this).attr('target')
        // console.log(id)
        $.ajax({
            method:'POST',
            url:`/shop/${id}/unsatisfaction`,
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).done(function(data){
            if(data.success == false){
                $('.click-shop-satisfaction-active').addClass('hide')
                $('.click-shop-satisfaction').removeClass('hide')
                $('.alert-uncollect').removeClass('hide');
                setTimeout(function(){
                    $('.alert-uncollect').addClass('hide');
                },2000)
                // $('.click-shop-collect').addClass('gray-small')
            }
            console.log(data)
        }).fail(function(err){
            console.log(err)
        })
    })
    //计数
    $('.click_shop_count_add').click(function(event){
        // event.preventDefault();
        var count = $('.click_shop_count_block')
        count.val(parseInt(count.val())+1)
    })
    $('.click_shop_count_remove').click(function(event){
        // event.preventDefault();
        var count = $('.click_shop_count_block')
        if(parseInt(count.val())) {
            count.val(parseInt(count.val()) - 1)
        }else {
            count.val("0");
        }
    })
});