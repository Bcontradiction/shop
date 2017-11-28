/**
 * Created by Administrator on 2017/9/25.
 */
//保存登录用户的信息
const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;
const Shop = require('../model/Shop')
const BaseModel = require('./base_model');
const UserSchema = new Schema({
    //用户的ID
    _id:{
        type:String,
        default:shortid.generate,
        unique:true //id经常会被查询,所以，把ID作为索引
    },
    //用户名
    name:{
        type:String,
        require:true
    },
    //密码
    password:{
        type:String,
        require:true
    },
    //邮箱
    email:{
        type:String
    },
    //个人简介
    motto:{
        type:String,
        default:'这家伙很懒,什么都没有留下...'
    },
    //个人头像
    avatar:{
        type:String,
        default:'/images/Standby.png'
    },
    // 创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //更新时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //用户的信誉值
    reputation:{
        type:Number,
        default:0
    },
    //用户的积分
    score:{
        type:Number,
        default:0
    },
    //创建商品的数量
    commodity_count:{
        type:Number,
        default:0
    },
    //买家评论的数量
    reply_count:{
        type:Number,
        default:0
    },
    /*用户状态*/
    is_activate:{
        type:Boolean,
        default:true
    },
    //用户是否具有vip权限
    vip:{
        type:Boolean,
        default:true
    },
    //用户创建商品的默认实物图
    pictures:{
        type:String,
        default:'/images/default.jpg'
    },
    //用户收藏的商品
    collect: [{
        _id: {
            type: String,
            default: shortid.generate,
            unique: true
        },
        //商品的作者
        userName: String,
        //商品的name
        shopName: String,
        //商品的id
        shop_id: String,
        //商品价格
        price:Number,
        //商品实物图
        pictures:String,
        //商品创建时间
        create_time:String

    }],
    //赞过的商品
    satisfaction:[{
        //商品的id
        _id: {
            type: String,
            default: shortid.generate,
            unique: true
        },
        //商品的作者
        userName: String,
        /*//商品的name
        shopName: String,
        //商品的id
        shop_id: String*/
    }],
    /*//谁赞过你
    like:{
        type: [String]
    }*/

})
//给这个User表添加静态方法
UserSchema.statics = {
    getUserByName:(name,callback)=>{
        User.findOne({name:name},callback)
    },
    getUserByEmail:(email,callback)=>{
        User.findOne({email:email},callback)
    },
    getUserById:(id,callback)=>{
        User.findOne({_id:id},callback)
    },
    getUserByNames:(names,callback)=>{
        if(names.length == 0){
            return callback(null,[]);
        }
        User.find({name:{$in:names}},callback);
    }
}
UserSchema.plugin(BaseModel);
const User = mongoose.model('User',UserSchema);
module.exports = User
