/**
 * Created by Administrator on 2017/11/8.
 */
//点击回复，显示对应的二级回复表单
//利用了事件委托机制
$(document).on('click','.aw-show-comment',function(event){
    var targetA = $(event.target);
    var awItem = targetA.closest('.aw-item');
    //要回复的人的名字
    var username = awItem.find('.aw-user-name').attr('name');
    awItem.find('form').removeClass('hide').end().find('.meta').hide().end().find('.comment_markdown').attr('placeholder',`回复${username}`).focus();
})
//点击取消，隐藏对应的二级回复表单，并且显示点赞按钮
$(document).on('click','.close-comment-box',function(event){
    var targetA = $(event.target);
    var awItem = targetA.closest('.aw-item');
    awItem.find('form').addClass('hide').end().find('.meta').show();
})
//监听表单的keyup事件，如果内容为空，则评论按钮无法点击
$(document).on('keyup','.comment_markdown',function(event){
    var targetMarkdown = $(event.target);
    var targetForm = targetMarkdown.closest('form');
    var targetBtn = targetForm.find('.commentBtn');
    if($(this).html().replace(/[&nbsp;\s+]/g,'').length <= 0){
        targetBtn.attr('disabled',true);
    }else{
        targetBtn.removeAttr('disabled');
    }
})
//点击评论按钮，提交表单数据以及评论内容
$(document).on('click','input.commentBtn-one',function(event){
    event.preventDefault();
    //1.回复的内容
    var form = $(this).closest('form');
    var content = form.find('.comment_markdown').html();
    var regex1 = new RegExp('<div>','g');
    var regex2 = new RegExp('</div>','g');
    content = content.replace(regex1,'<p>').replace(regex2,'</p>');
    //2.一级回复的ID以及对应回复的人
    var reply_id = form.find('input[name=reply_id]').val();
    var comment_target_id = form.find('input[name=comment_target_id]').val();
    //数据整合成一个对象
    var data = {
        content,
        reply_id,
        comment_target_id
    };
    $.ajax({
        type:'POST', //发送ajax的方式,GET请求基本上获取数据的，POST提交数据.
        url:form.attr('action'),
        data:$.param(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
    }).done(result=>{
        form.before(result);
    }).fail(err=>{
        console.log(err);
    })

    /*去除默认样式*/
    $('.shop-type-index option,.shop-value-input input').focus(function(){
        $("input").css("border","rgb(210,210,210)");
    });
$('.click-shop-edit').click(function(event){
    window.location.href = $(this).children('a').attr('href')
})

})
/*
//点击显示评论按钮，显示所有的评论内容
$(document).on('click','.aw-add-comment',function(event){
    console.log(1)
    var targetA = $(event.target);
    var awItem = targetA.closest('.aw-item');
    var reply_id = awItem.attr('id');
    console.log(reply_id)
    var off = awItem.attr('off');
    if(off == 'true'){
        $.ajax({
            beforeSend:function(){
                //显示所有的二级回复以及提交表单
                awItem.find('.loading').show();
                awItem.find('.aw-comment-box').removeClass('hide');
                targetA.html('收起评论');
                // console.log(1)
            },
            type:'GET',
            url:`/${reply_id}/showComments`
        }).done(result=>{
            //console.log(2)
            awItem.find('.add-comment-list').html(result);
            awItem.find('.loading').hide();
        }).fail(err=>{
            //console.log(3)
            console.log(err);
        })
        awItem.attr('off','false');
    }else{
        //隐藏所有的二级回复以及清空所有的内容
        awItem.find('.aw-comment-box').addClass('hide');
        targetA.html('<i class="fa fa-comment"></i> ' + $(targetA).attr('content'));
        awItem.attr('off','true');
    }
})
//针对某个人进行回复的时候
$(document).on('click','input.commentBtn-two',function(event){
    event.preventDefault();
    //1.回复的内容
    var form = $(this).closest('form');
    var content = form.find('.comment_markdown').html();
    var regex1 = new RegExp('<div>','g');
    var regex2 = new RegExp('</div>','g');
    content = content.replace(regex1,'<p>').replace(regex2,'</p>');
    //2.一级回复的ID以及对应回复的人
    var reply_id = form.find('input[name=reply_id]').val();
    var comment_target_id = form.find('input[name=comment_target_id]').val();
    //数据整合成一个对象
    var data = {
        content,
        reply_id,
        comment_target_id
    };
    $.ajax({
        type:'POST',
        url:form.attr('action'),
        data:$.param(data),
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
    }).done(result=>{
        form.closest('.aw-item').after(result);
        form.addClass('hide').siblings('.meta').show();
    }).fail(err=>{
        console.log(err);
    })
})
//问题回复页面，二级回复的分页
$(document).on('click','a.commentPage',function(event){
    let targetA = event.target;
    let page = $(targetA).text();
    let reply_id = $(this).parents('.aw-item').attr('id');
    // let comment_count = $(this).parents('.mod-footer').closest('.aw-add-comment').attr('content')
    // console.log(page)
    // console.log(reply_id)
    // console.log(comment_count)
    $.ajax({
        method:'POST',
        url:`/showCommentsPage/${reply_id}/${page}`,
        headers:{'Content-Type':'application/x-www-form-urlencoded'}
    }).done(function(data){
        console.log(data)
        $('#page_read .aw-item').remove();
        $('#page_read').prepend(data);
        //将当前的page对应的li添加active属性
        let index = $(targetA).closest('li').index();
        $('.pagination li').removeClass('active').eq(index).addClass('index');
    }).fail(function(err){
        console.log(100)
        console.log(err);
    })
})*/



