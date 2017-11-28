/**
 * Created by Administrator on 2017/11/7.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const at = require('../common/at');
const BaseModel = require('./base_model');
const Shop = require('../model/Shop')
const ReplySchema = new Schema({
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //留言的内容
    content:{
        type:String,
        require:true,
        default:'对这个商品有没有话想说呢?'
    },
    //留言的时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //留言的修改时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //留言的那个人
    author:{
        type:String,
        ref:'User'
    },
    //二级回复的时候设置它,回复的ID
    reply_id:{
        type:String
    },
    //留言的对应商品
    shop_id:{
        type:String,
        ref:'Shop'
    },
    //增加删除功能
    deleted:{
        type:Boolean,
        default:false
    },
    //增加点赞功能
    likes:{
        type:[String],
        ref:'User'
    },
    /*//踩的功能
    unlikes:{
        type:[String],
        ref:'User'
    },*/
    //二级回复的数量
    comment_num:{
        type:Number,
        default:0
    }

})


ReplySchema.plugin(BaseModel);
ReplySchema.statics = {
    getRepliesByTopicId:(id,callback)=>{
        Reply.find({'question_id':id,'deleted':false},'',{sort:'create_time'}).populate('author').then(replies=>{
            if(replies.length === 0){
                return callback(null,[]);
            }
            for(let index of replies.keys()){
                replies[index].content = at.linkUsers(replies[index].content);
            }
            return callback(null,replies);
        }).catch(err=>{
            return callback(err);
        })
    },
    //获取问题的五条回复
    getRepliesByQuestionId:(shop_id,callback)=>{
        Reply.find({'shop_id':shop_id}).sort({'create_time':1}).limit(5).populate('author').exec(callback)
    },
    //获取问题的全部回复
    getRepliesByQuestionIds:(shop_id,callback)=>{
        Reply.find({'shop_id':shop_id}).sort({'create_time':1}).populate('author').exec(callback)
    },
    //个人中心
    getRepliesFind:(author_id,opt,callback)=>{
        Reply.find({author:author_id},{},opt).populate('author').populate('article_id').then(replies=>{
            return callback(null,replies);
        }).catch(err=>{
            return callback(err);
        })
    }
}
const Reply = mongoose.model('Reply',ReplySchema);
module.exports = Reply