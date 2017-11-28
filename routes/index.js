//静态资源的对象
const mapping = require('../static')
//验证模块
const validator = require('validator')
//引入User表
const User = require('../model/User');
//引入数据库操作文件db.js
const DbSet = require('../model/db');
//引入配置文件
const setting = require('../setting');
//发送邮件的文件
const mail = require('../common/mail');
//引入权限的文件
const auth = require('../common/auth')
//首页的处理函数
exports.indexHome = (req,res,next)=>{
    /*res.render('index',{
        title:'首页',
        layout:'indexTemplate'
    })*/
    // res.render('home',{
    //     title:'???',
    //     resource:mapping.home
    // })
    res.render('index',{
        title:'商铺',
        layout:'indexTemplate'
    })
}
//注册页面的处理函数
exports.register = (req,res,next)=>{
    res.render('register',{
        title:'注册页面',
        layout:'indexTemplate',
        resource:mapping.register
    })
}
//登录页面的处理函数
exports.login = (req,res,next)=>{
    res.render('login',{
        title:'登录页面',
        layout:'indexTemplate',
        resource:mapping.login
    })
}
//注册行为的处理函数
exports.postRegister = (req,res,next)=>{
    //1.后端验证数据
    //express 中,post请求一般使用req.body 接收
    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;
    // console.log(email)
    // console.log(name)
    // console.log(password)
    let error;
    if(!validator.isEmail(email)){
        error = '邮箱的格式不正确'
    }
    if(!validator.matches(name,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/,'g')){
        error = '用户名不合法,5-12位,数字字母下划线'
    }
    if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/,'g') ||
        !validator.isLength(password,6,12)){
        error = '密码长度5-12位，非特殊字符'
    }
    //如果验证的有错误,那么发送这个错误的提示信息
    if(error){
        res.end(error);
    }else{
        //验证成功后，判断一下用户名和邮箱是否存在
        let query = User.find().or([{email:email},{name:name}]);
        query.exec().then(user=>{
            if(user.length > 0){
                //找到这个用户了,说明它以前注册过
                error = '这个账号已经被注册了'
                res.end(error);
                console.log(error)
            }else{
                //没重复的情况,允许注册
                //发送邮件
                // auth.gen_session(user,res);//生成cookie
                var regMsg = {name:name,email:email};

                let newPSD = DbSet.encrypt(password,setting.psd);
                req.body.password = newPSD;
                DbSet.addOne(User,req,res,'success');
                // console.log(user)
                mail.sendEmail('reg_mail',regMsg, user, (info)=>{
                    // console.log(info);
                })
            }
        }).catch(err=>{
            res.end(err)
        })
    }
}
//登录行为的处理函数
exports.postLogin = (req,res,next)=>{
    let name = req.body.name;
    let password = req.body.password;
    let getName;//用用户名登录
    let getUser;//方法,通过用户名和密码来获取用户的登录信息
    let getEmail;//用邮箱登录
    let error;//错误提示
    name.includes('@') ? getEmail = name : getName = name;
    //1.判断用户名是否合法
    if(getName){
        if(!validator.matches(getName,/^[a-zA-Z][a-zA-Z0-9_]{4,11}$/,'g')){
            error = '用户名不合法';
        }
    }
    //2.判断邮箱是否合法
    if(getEmail){
        if(!validator.isEmail(getEmail)){
            error = '邮箱格式不正确'
        }
    }
    //3.验证密码
    if(!validator.matches(password,/(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{5,}/,'g') ||
        !validator.isLength(password,6,12)){
        error = '密码不合法,长度在5-12位,请重新输入'
    }
    //4.如果验证不成功,直接将错误提示返回，让用户重新填写内容
    if(error){
        return res.end(error);
    }else{
        //验证成功
        if(getEmail){
            getUser = User.getUserByEmail;
        }else{
            getUser = User.getUserByName;
        }
        getUser(name,(err,user)=>{
            if(err){
                return res.end(err);
            }
            if(!user){
                return res.end('该用户名/邮箱不存在')
            }
            //最后一步.比较密码
            let newPSD = DbSet.encrypt(password,setting.psd);
            if(user.password != newPSD){
                return res.end('密码错误,请重新输入')
            }
            //生成cookie
            auth.gen_session(user,res);
            //正确了,直接返回一个字符串,success
            return res.end('success')
        })
    }
}
//退出行为的处理函数
exports.logout = (req,res,next)=>{
    //清除session
    req.session.destroy()
    //cookie删除
    res.clearCookie(setting.auth_name);
    res.redirect('/')
}
//激活账号
exports.active = (req,res,next)=>{
    let user_id = req.params.id;
    // console.log(user_id)
    User.findOne({'_id':user_id}).then(user=>{
        if(err){
            return res.end(err);
        }
        // console.log(user);
        user.is_activate = false;
        user.save();
        console.log(user)
        return res.render('is_active',{
            title:'激活账户'
        })
    })
}

