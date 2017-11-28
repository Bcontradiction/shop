/**
 * Created by hama on 2017/10/12.
 */
const validator = require('validator');
const Reply = require('../model/Reply');
const Shop = require('../model/Shop');
const User = require('../model/User');
const at = require('../common/at');
const message = require('../common/message');
exports.add = (req,res,next)=>{
    //商品的ID
    let shop_id = req.params.shop_id;
    // console.log(shop_id)
    //回复的内容
    let content = req.body.content;
    content = validator.trim(String(content));
    if(content === ''){
        return res.end('内容不能为空');
    }else{
        //存到Reply表里面去
        let newReply = new Reply();
        newReply.content = content;
        newReply.shop_id = shop_id;
        newReply.author = req.session.user._id;
        //1.第一个任务，是存入reply表
        newReply.save().then(reply=>{
            // console.log(reply)
            //先把对应的关联查询出来，获得完整的reply表信息
            let result =  Reply.findOne({'_id':reply._id}).populate('shop_id').populate('author');
            // console.log(shop_id)
            return result;
        }).then(reply=>{
            // console.log(reply)
            //2.更新shop表里面的信息
            reply.shop_id.last_reply = reply._id;
            reply.shop_id.last_reply_time = new Date();
            reply.shop_id.last_reply_author = reply.author;
            reply.shop_id.comment_num += 1;
            reply.shop_id.save();
            return reply;
        }).then(reply=>{
            //3.给当前@的人发送消息，里面不包含作者
            User.findOne({'_id':reply.shop_id.author}).then(author=>{
                let author_name = author.name;
                let regex = new RegExp('@' + author_name + '\\b(?!\\])', 'g');
                let newContent = content.replace(regex,'');
                at.sendMessageToMentionUsers(newContent,reply.shop_id._id,reply.author._id,reply._id,(err,msg)=>{
                    if(err){
                        res.end(err);
                    }
                })
            })
            return reply
        }).then(reply=>{
            //4. 用户积分+1,回复数量+1
            reply.author.score += 1;
            reply.author.reply_count += 1;
            reply.author.save();
            req.session.user = reply.author;
            return reply
        }).then(reply=>{
            // console.log(reply)
            //5.给当前作者发一条有人给它回复的消息
            //如果当前作者给自己的文章回复，是不能发消息的
            let shop_author = reply.shop_id.author;
            if(shop_author != req.session.user._id){
                //发消息
                message.sendReplyMessage(shop_author,req.session.user._id,reply.shop_id._id,reply._id,null);
            }
            return res.json({message:'success'});
        }).catch(err=>{
            res.end(err);
        });
    }
}
//点赞行为
exports.likes = (req,res,next)=>{
    //获取一级回复的id
    let reply_id = req.params.reply_id;
    console.log(reply_id)
    //获取点赞人的id
    let user_id = req.session.user._id;
    // console.log(user_id)
    let user_name = req.session.user.name;
    Reply.findOne({'_id':reply_id},{'deleted':false}).populate('author').exec(function(err,reply){
        console.log(reply)
        if(reply.likes == ''){
            console.log(1313)
            reply.likes.push('user_name')
            console.log(9797)
            reply.save()
            return res.end('like')
        }else{
            let index = reply.likes.indexOf('user_name');
            if(index == -1){
                reply.likes.push('user_name')
                reply.save()
                return res.end('like')
            }else{
                reply.likes.splice(index,1)
                reply.save()
                return res.end('unlike')
            }
        }
    })

}