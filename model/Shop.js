/**
 * Created by Administrator on 2017/11/7.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const setting = require('../setting');
const _ = require('lodash');
const Reply = require('../model/Reply');
const BaseModel = require('./base_model');
const at = require('../common/at')
const ShopSchema = new Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //商品的名称
    shopname:{
        type:String,
        require:true
    },
    //商品的介绍
    describe:{
        type:String,
        require:true
    },
    //商品的价格
    price:{
        type:Number,
        require:true
    },
    //商品的实物图
    pictures:{
        type:String,
        default:''
    },
    //商品的重量
    weight:{
        type:String,
        default:'0.00g'
    },
    //创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //修改时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //点击量
    click_num:{
        type:Number,
        default:0
    },
    //回复量
    comment_num:{
        type:Number,
        default:0
    },
    //收藏量
    collect_num:{
        type:Number,
        default:0
    },
    //非常满意
    satisfaction_num:{
        type:Number,
        default:0
    },
    //还好
    notBad_num:{
        type:Number,
        default:0
    },
    //一般
    soSo_num:{
        type:Number,
        default:0
    },
    //差劲
    disappointing_num:{
        type:Number,
        default:0
    },
    //非常差
    veryBad_num:{
        type:Number,
        default:0
    },
    //商品的分类
    category:{
        type:String
    },
    //最后的回复的评论
    last_reply:{
        type:String,
        ref:'Reply'
    },
    //最后回复的时间
    last_reply_time:{
        type:Date,
        default:Date.now
    },
    //最后回复的那个人
    last_reply_author:{
        type:String,
        ref:'User'
    },
    //发布人
    author:{
      type:String,
      ref:'User'
    },
    //增加删除功能
    deleted:{
        type:Boolean,
        default:false
    },
    //点赞人的集合
    click_likes:[{
        //点赞人的id
        _id: {
            type: String,
            default: shortid.generate,
            unique: true
        },
        //点赞人的username
        userName: String
    }]
})
//创建一个虚拟字段
ShopSchema.virtual('categoryName').get(function () {
    let category = this.category;
    let pair = _.find(setting.categorys,function (item) {
        return item[0] == category;
    })
    if(pair){
        return pair[1]
    }else{
        return '';
    }
})
ShopSchema.statics = {
    //根据条件获取文章列表
    getShopByQuery:(query,opt,callback)=> {
        query.deleted = false;
        Shop.find(query,{},opt).populate('author').populate('last_reply').populate('last_reply_author').then((shops)=>{
            if(shops.length == 0){
                return callback(null,[]);
            }
            //如果这篇文章的作者已经被删除，那么它这篇文章应该也设置为空
            //暂时先不做这方面的工作，因为感觉现在还没必要
            return callback(null,shops);
        }).catch(err=>{
            return callback(err);
        })
    },
    //edit
    getArticle:(id,callback)=>{
        Shop.findOne({'_id':id}).populate('author').then((shop)=>{
            return callback(null,shop);
        }).catch(err=>{
            return callback(err);
        })
    },
    //编辑页面,根据ID获取一篇文章
    getQuestion:(id,callback)=>{
        Shop.findOne({'_id':id}).populate('author').then(shop=>{
            return callback(null,shop);
        }).catch(err=> {
            return callback(err)
        })
    },
    getNullQuestion:(id,callback)=>{
        Shop.findOne({'_id':id,'deleted':false}).populate('author').populate('last_reply').populate('last_reply_author').then(shop=>{
            if(!shop){
                return callback(null,'该商品不存在或者已被删除');
            }
            if(!shop.author){
                return callback(null,'该商品的发布者或已注销账户');
            }
            shop.linkContent = at.linkUsers(shop.describe);
            //2.根据这篇文章的ID查询出对应的回复列表
            Reply.getRepliesByTopicId(shop._id,(err,replies)=>{
                return callback(null,'',shop,replies);
            })
        }).catch((err)=>{
            return callback(err);
        })
    }
}



ShopSchema.plugin(BaseModel);
const Shop = mongoose.model('Shop',ShopSchema);
module.exports = Shop
