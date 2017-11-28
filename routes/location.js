/**
 * Created by hama on 2017/10/12.
 */
const validator = require('validator');
const Reply = require('../model/Reply');
const Shop = require('../model/Shop');
const User = require('../model/User');
const Location = require('../model/Location');
//引入数据库操作文件db.js
const DbSet = require('../model/db');
exports.address = (req,res,next)=>{
    //获取当前登录用户的id
    let id = req.session.user._id;
    // console.log(id)
    let name = req.body.name;
    let url = req.body.url;
    let tel = req.body.tel;
    // let user_id = id;
    req.body.user_id = id
    let error;
    // console.log(name)
    // console.log(url)
    // console.log(tel)
    let query = Location.find().or([{url:url}])
    query.exec().then(url=>{
        if(url.length > 0){
            //找到这个地址了，说明以前创建过
            error = '你已经添加过这个地址了'
            res.end(error);
        }else{
            //没有重复地址的情况下,允许添加
            DbSet.addOne(Location,req,res,'success');
            // console.log(req.body)
        }
    }).catch(err=>{
        res.end(err)
    })

}

//删除行为
exports.urlDeleted = (req,res,next)=>{
    //获取要删除地址的id
    let url_id = req.params.id;
    console.log(url_id)
    Location.findOne({'_id':url_id}).then(url=>{

        url.deleted = true;
        console.log(url);
        url.save().then(url=>{
            return res.json({success:true,message:'删除成功'})
        })
    })
}

//编辑行为

exports.urlEdit = (req,res,next)=>{
    var url_id = req.params.id;
    var name = validator.trim(req.body.name);
    var url = validator.trim(req.body.url);
    var tel = validator.trim(req.body.tel);
    // console.log(url_id)
    // console.log(name)
    // console.log(url)
    // console.log(tel)
    console.log(req.body)
    //检测地址是否存在或者deleted状态为false;

    Location.findOne({'_id':url_id},{'deleted':false},(err,url)=> {
        if (!url) {
            return end('此商品已被删除或不存在')
        }

        if (String(url.user_id) === String(req.session.user._id)) {
            let error;
            if (error) {
                res.end(error);
            } else {
                url.name = name
                url.url = url;
                url.tel = tel;
                url.update_time = new Date();
                // console.log(url)
                url.save().then((url) => {
                    return res.json({url: `/user-list`});
                }).catch(err => {
                    return res.end(err);
                })
            }
        } else {
            return res.end('此话题您不具备编辑能力');
        }
    })
}

//设为默认

exports.urlDefault = (req,res,next)=>{
    let url_id = req.params.id;
    console.log(url_id);
    Location.findOne({'_id':url_id}).then(url=>{
        // console.log(url);
        url.is_activate = true;
        url.save().then(data=>{
            return res.json({success:true,message:'设置成功'})
        }).catch(err=>{
            return res.json({success:false,message:err})
        })
    })
}