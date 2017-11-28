/**
 * Created by Administrator on 2017/9/22.
 */
//1.声明注册模块
var registerApp = angular.module('registerApp',[]);
//2.在该模块下，声明一个registerController这样的控制器
registerApp.controller('registerController',($scope,$http)=>{
    $scope.formData = {};
    $scope.postForm = ()=>{
        //发送一个POST请求，用来提交用户注册的信息
        $http({
            method:'POST',//发送的方式
            url:'/register',//发送的地址
            data:$.param($scope.formData), //发送的数据
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            console.log(data)
            if(data.data == 'success'){
                //成功了
                $scope.success = '注册成功,5秒后跳转,请注意查收邮件';
                $('#successbox').fadeIn();
                setTimeout(function(){
                    window.location.href = '/login';
                },5000)
            }else{
                //失败了
                $scope.error  = data.data ;//返回的失败信息
                $('#errorbox').fadeIn();
                setTimeout(function(){
                    $('#errorbox').fadeOut();
                },1000)
            }
        }).catch(err=>{
            console.log(err);//失败以后调用的代码
        })
    }
})
//创建一个登录模块
var loginApp = angular.module('loginApp',[]);
loginApp.controller('loginController',($scope,$http)=>{
    $scope.formData = {};
    //提交用户的登录信息
    $scope.postForm = ()=>{
        $http({
            method:'POST',
            url:'/login',
            data:$.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            if(data.data == 'success'){
                window.location.href = '/';
            }else{
                $scope.error = data.data;
                $('#errorbox').fadeIn();
                setTimeout(()=>{
                    $('#errorbox').fadeOut();
                },1000)
            }
        }).catch(err=>{
            console.log(err);
        })
    }
})

//问题详情
const questionApp = angular.module('questionApp',[]);
questionApp.controller('questionController',($scope,$http)=>{
    let simplemde = new SimpleMDE({
        element: $("#reply_markdown")[0],
        status:false,
        styleSelectedText:false,
    });
    $(function(){
        $('.CodeMirror').css('minHeight','70px');
        $('.CodeMirror-scroll').css('minHeight','70px');
        $('#reply_button').attr('disabled',true);
        simplemde.codemirror.on('change',function(){
            if(simplemde.value().replace(/\s+/g,'').length > 0){
                $('#reply_button').removeAttr('disabled');
            }else{
                $('#reply_button').attr('disabled',true);
            }
        })
    })
    $scope.postForm = ()=>{
        //要发送的地址
        let url = $('#reply_form').attr('target');
        let content = simplemde.value();
        $http({
            method:'POST',
            url:url,
            data:$.param({content:content}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            if(data.data.message == 'success'){
                window.location.reload();
            }else{
                alert(data.data);
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    //问题的回复页面，点击 加载更多 返回全部回复
    $scope.allReply=()=>{
        let Id =  $('#allreply').attr('data-id')
        // console.log(Id)
        $http({
            method:'get',
            url:`/undateAllMessage/${Id}`,
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            console.log(data.data)
            $('#reply .aw-item').remove();
            $('#reply').prepend(data.data);
            $('#allreply').css('display','none')
            console.log(data.data)
        }).catch(err=>{
            console.log(err)
        })
    }
    //删除操作
    $scope.delete = (event)=>{
        let targetA = $(event.currentTarget);
        let id = targetA.attr('target');
        console.log(id)
        if(id !== '' && confirm('确定要删除这个问题吗？')){
            window.location.href = '/';
            $http({
                method:'POST',
                url:`/question/${id}/delete`,
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            }).success((data)=>{
                console.log(data)
                if(!data.success){
                    alert(data.message);
                }else{

                }
            }).error(err=>{
                console.log(err);
            })
        }
    }
})
