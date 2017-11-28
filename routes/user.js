/**
 * Created by Administrator on 2017/9/22.
 */
//引入动态的CSS设置
const mapping = require('../static');
const formidable = require('formidable');
const moment = require('moment');
const fs = require('fs');
const gm = require('gm');
const User = require('../model/User')
const validator = require('validator')
const Shop = require('../model/Shop')
const Location = require('../model/Location')
const setting = require('../setting');
//个人设置、信息、收藏、收货地址、资料编辑、发表的商品页面
//个人设置(头像编辑、个人介绍以及邮箱、用户名的显示 是否拥有会员权益
exports.setting = (req,res,next)=>{
    //获取当前登录用户的id
    let id = req.session.user._id;
    // console.log(id)

    //根据id 查出发布的商品,收藏/收货地址/

    //收藏的商品

    //发布过的商品
    Shop.find({'author':id,'pictures':''}).exec(function(err,doc){
        if(err){
            res.end(err);
        }
        for(var i=0;i<doc.length;i++){
            doc.deleted = true
        }
        // console.log(doc)

    })
    Shop.find({'author':id,'deleted':false}).then(shop=>{
        // console.log(shop)
        //已有的地址
        // let remove_id =
        // Shop.remove({_id:{$in:}})
        // 获取当前登录用户的name
        let user_id = req.session.user._id;
        // console.log(user_id)
        Location.find({'user_id':user_id,'deleted':false}).sort({'last_reply_time':-1,'create_time':-1}).then(url=>{
            // console.log(url)
            //返回收藏的商品
            User.findOne({'_id':id}).then(users=>{
                // console.log(user)
                // const arr_collect = user.collect
                // console.log(arr_collect)
                // console.log(user.collect)
                return res.render('user-list',{
                    title:'用户的信息列表',
                    layout:'indexTemplate',
                    resource:mapping.shop,
                    shop:shop,
                    url:url,
                    users:users
                })
            })

        })

    }).catch(err=>{
        console.log(err)
    })

}

//更新头像的行为
exports.updateImage = (req,res,next)=>{
//初始化
    let form = new formidable.IncomingForm();
    form.uploadDir = 'public/upload/images/';
    let updatePath = 'public/upload/images/';
    let smallImgPath = "public/upload/smallimgs/";
    let files = [];
    let fields = [];
    form.on('field',function(field,value){
        fields.push([field,value]);
    }).on('file',function(field,file){
        //文件的name值
        //console.log(field);
        //文件的具体信息
        //console.log(file);
        files.push([field,file]);
        let type = file.name.split('.')[1];
        let date = new Date();
        let ms = moment(date).format('YYYYMMDDHHmmss').toString();
        let newFileName = 'img' + ms + '.' + type;
        fs.rename(file.path,updatePath + newFileName,function(err){
            var input = updatePath + newFileName;
            var out = smallImgPath + newFileName;
            gm(input).resize(100,100,'!').autoOrient().write(out, function (err) {
                if(err){
                    console.log(err);
                }else{
                    console.log('done');
                    //压缩后再返回，否则的话，压缩会放在后边，导致链接失效
                    return res.json({
                        error:'',
                        initialPreview:['<img src="' + '/upload/smallimgs/' + newFileName + '">'],
                        url:out
                    })
                }
            });
        })
    })
    form.parse(req);
}
//更新个人资料的行为
exports.updateUser = (req,res,next)=>{
    let id = req.params.id;
    let motto = req.body.motto;
    let avatar = req.body.avatar;
    let error;
    if(!validator.isLength('motto',0)){
        error = '个性签名不能为空';
    }
    if(!validator.isLength('avatar',0)){
        error = '头像的地址不能为空';
    }
    if(error){
        res.end(error);
    }else{
        //查询数据库对应用户信息
        User.getUserById(id,(err,user)=>{
            if(err){
                return res.end(err);
            }
            if(!user){
                return res.end('用户不存在');
            }
            user.update_time = new Date();
            user.motto = motto;
            user.avatar = avatar;
            console.log(avatar)
            user.save().then((user)=>{
                req.session.user = user;
                return res.end('success');
            }).catch((err)=>{
                return res.end(err);
            })
        })
    }
}
//用户收藏的商品列表
exports.collect = (req,res,next)=>{

}

//索引的页面
exports.indexes = (req,res,next)=>{
    console.log(23)
    res.render('index',{
        title:'商铺',
        layout:'indexTemplate'
    })
}


//从收藏列表删除
exports.deletedUserList = (req,res,next)=>{
    let id = req.params.id
    console.log(id)
    let user_id = req.session.user._id
    /*User.update({'_id':user_id},{$pull{collect:{"_id":id}}}).then(user=>{

    })*/
    // console.log(id)
    // User.findOne({'_id':user_id}).exec(function(err,user){
    //     if(err){
    //         res.end(err)
    //     }else {
    //         // console.log(user)
    //         // user.collect.pull('id')
    //         console.log(user.collect)
    //
    //     }
    //
    // })

}
