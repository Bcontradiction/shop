const mapping = require('../static');
const setting = require('../setting');
const validator = require('validator')
const Shop = require('../model/Shop');
const User = require('../model/User');
const Cart = require('../model/Cart')
const Location = require('../model/Location')
const formidable = require('formidable');
const fs = require('fs');
const gm = require('gm');
const _ = require('lodash')
//引入at模块
const at = require('../common/at');
const moment = require('moment');
//引入reply表
const Reply = require('../model/Reply');

/*添加商品的页面*/
exports.addShop = (req,res,next)=>{
    res.render('add-shoping',{
        title:'添加商品',
        layout:'indexTemplate',
        resource:mapping.shop,
        categorys:setting.categorys
    })
}
//上传商品实物图的行为
exports.addUpdateImage = (req,res,next)=>{
//初始化
//     console.log(111111111)
    let form = new formidable.IncomingForm();
    form.uploadDir = 'public/pictures/images/';
    let updatePath = 'public/pictures/images/';
    let smallImgPath = "public/pictures/smallimgs/";
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
            if(err){
                console.log(err)
            }else{
                console.log('done')
            }
            var input = updatePath + newFileName;
            // var out = smallImgPath + newFileName;
            // gm(input).resize(100,100,'!').autoOrient().write(out, function (err) {
            //     if(err){
            //         console.log(err);
            //     }else{
            //         console.log('done');
                    //压缩后再返回，否则的话，压缩会放在后边，导致链接失效
                    return res.json({
                        error:'',
                        initialPreview:['<img src="' + '/pictures/images/' + newFileName + '">'],
                        url:input
                    })
                // }
            });
        // })
    })
    form.parse(req);
    // console.log(req.body)
}
/*添加商品的行为*/
exports.postAddShop = (req,res,next)=>{
    // console.log(req.body)
    //商品的分类
    let category = validator.trim(req.body.category);
    //商品的名称
    let shopname = validator.trim(req.body.shopname)
    //商品的描述
    let describe = validator.trim(req.body.describe)
    //商品的价格
    let price = validator.trim(req.body.price);
    //商品的实物图
    let pictures = req.body.pictures;
    // console.log(1)
    // console.log(pictures)
    // console.log(2)
    //商品的重量
    let weight = validator.trim(req.body.weight)
    // console.log(category)
    // console.log(shopname)
    // console.log(describe)
    // console.log(price)
    // console.log(pictures)
    let error;
    if(!validator.isLength(shopname,{min:1,max:50})){
        error = '商品的名字过长'
    }
    if(!validator.isLength(describe,{min:1,max:40})){
        error = '商品的描述多的超出了显示屏!'
    }
    if(!validator.isLength(price,{min:1,max:20})){
        error = 'emmm..'
    }
    if(!validator.isLength('pictures',0)){
        error = '实物图地址不能为空'
    }
    if(!validator.isLength(weight,{min:1,max:20})){
        error = '超重!'
    }
    if(error){
        return res.end(String(error));
    }else{
        //验证成功后
        req.body.author = req.session.user._id;
        // console.log(req.body.author)
        let newShop = new Shop(req.body);
        // console.log(req.body)

        // console.log(newShop)
        newShop.save().then(shop=>{
            console.log(shop)
            //每发表一件商品,该用户的积分+2,发表数量+1
            User.getUserById(req.session.user._id,(err,user)=>{
                if(err){
                    return res.end(err)
                }
                // console.log(user)
                // console.log(shop)
                user.score += 2;
                user.commodity_count += 1;
                // console.log(user)
                // console.log(shop)
                //数组去重
                _.union([user])
                user.save();
                req.session.user = user;
                // console.log(shop._id)
                //返回的是一个添加问题的页面地址
                res.json({url:`/shop/${shop._id}`})
            })
        }).catch(err=>{
            return res.end(err);
        })
    }
}

//单个商品的详情页面
exports.index = (req,res,next)=>{
    //商品的id
    let shop_id = req.params.id;
    // console.log(shop_id)
    //1.商品的信息
    //2.商品的回复信息
    //3.发布商品作者的其他相关商品推荐
    Shop.findOne({'_id':shop_id,'deleted':false}).populate('author').populate('last_reply_author')
        .then(shop=>{
            // console.log(shop)
            if(shop == null){
                return res.render('error',{
                    title:'出错了',
                    layout:'indexTemplate',
                    resource:mapping.shop,
                    message:'该商品不存在或者已经被删除了',
                    error:''
                })
            }
            //商品的访问量 +1
            shop.click_num += 1;
            shop.save();

            //这里解决一个bug. 在发布页面，每发布一个商品，接口跳转时会在数据库自动储存一个除了图片地址之外相同商品信息的shop
            //在这里删除掉
            //获取当前用户id
            let id = req.session.user._id;
            console.log(id)
            Shop.remove({'pictures':''}).then(success=>{
                console.log(success)
            }).catch(err=>{
                console.log(err);
            })
            // User.update({'_id': user_id}, {'$pull': {collect: {shop_id: shop_id}}}).then(() => {

            //来获取文章对应的所有的回复
            //reply表
            Reply.getRepliesByQuestionId(shop._id,(err,replies)=>{
                // console.log(replies)
                if(replies.length > 0){
                    replies.forEach((reply,index)=>{
                        reply.content = at.linkUsers(reply.content)
                    })
                }
                // console.log(replies)
                let user = req.session.user._id
                // console.log(user)
                //获取商品对应的所有回复
                // shop.replies = replies
                //获取这个店主的其他商品(获取五条
                let options = {limit:5,sort:'-last_reply_time'};
                let query = {author:shop.author,_id:{'$nin':[shop._id]}};
                Shop.getShopByQuery(query,options,function(err,shops){
                    //根据当前登录用户的id获取地址，如果有默认地址选中默认，没有则选取最近的那一个
                    let user_id = req.session.user._id
                    // console.log(user_id)
                    Location.findOne({'user_id':user_id,'deleted':false}).then(url=>{
                        // console.log(url)

                        return res.render('shop',{
                            title:'商品的详细信息',
                            layout:'indexTemplate',
                            resource:mapping.shop,
                            shop:shop,
                            others:shops,
                            replies:replies,
                            userInfo:user,
                            url:url
                        })

                    })
                    // console.log(url)

                })
            })

        }).catch(err=>{
        console.log(err)
    })


}

/*全部商品的显示页面*/
exports.getShoping = (req,res,next)=>{
    //返回数据库中的所有商品
    Shop.find({'deleted':false}).populate('author').exec(function(err,shop){
        // console.log(shop)
        if(err){
            res.end(err)
        }else{

            return res.render('shoping',{
                title:'商店',
                layout:'indexTemplate',
                resource:mapping.shop,
                shop:shop
            })
        }

    })

}
/*购物车列表*/
exports.shopingList = (req,res,next)=>{
    //获取当前用户的id,根据id去查该用户名创建的所有购物车中的商品
    let user_id = req.session.user._id
    // console.log(user_id)
    User.findOne({'_id':user_id,'is_activate':true}).exec(function(err,user){
        if(err){
            res.end(err);
        }else{
            // console.log(user) ******************
            Cart.findOne({'cart_name':user.name},{'deleted':false}).then(userCart=>{
                res.render('shoping-list',{
                    title:'购物车列表',
                    userCart:userCart,
                    layout:'indexTemplate',
                    resource:mapping.shop,
                })
            })
        }
    })

}

//收藏商品的行为
exports.postCollectShop = (req,res,next)=>{
    //获取当前商品的id
    let shop_id = req.params.id;
    // console.log(shop_id)
    //获取当前收藏人的id
    let user_id = req.session.user._id
    // console.log(user_id)
    Shop.findOne({'_id':shop_id}).populate('author').exec(function(err,shop){
        if(err){
            res.end(err)
        }else{
            //判断一下。如果该用户已经收藏过该商品，则不能重复收藏
            let collect = {
                userName:shop.author.name,
                shopName:shop.shopname,
                shop_id:shop_id,
                create_time:shop.create_time,
                price:shop.price,
                pictures:shop.pictures
            }
            console.log(collect)
            User.findOne({'_id':user_id},function(err,user){
                user.collect.push(collect)
                // console.log(user);
                user.save()
                console.log('收藏成功!')
                res.json({success:true,message:'收藏成功!'})
            })
        }

    })

}
//删除收藏商品的行为
exports.deleteCollectShop = (req,res,next)=>{
    //获取当前商品的id
    let shop_id = req.params.id;
    // console.log(shop_id)
    //获取当前收藏人的id
    let user_id = req.session.user._id
    // console.log(user_id)
    Shop.findOne({'_id':shop_id}).populate('author').exec(function(err,shop){
        if(err){
            res.end(err)
        }else{
            //判断一下。如果该用户已经收藏过该商品，则不能重复收藏
            let collect = {
                userName:shop.author.name,
                shopName:shop.shopname,
                shop_id:shop_id,
                create_time:shop.create_time,
                price:shop.price,
                pictures:shop.pictures
            }
            // console.log(collect)
            User.findOne({'_id':user_id},function(err,user){
                for(let i=0;i<user.collect.length;i++){
                    // console.log(user.collect[i].shop_id)
                    if(user.collect[i].shop_id == shop_id) {
                        // console.log(5125)
                        User.update({'_id': user_id}, {'$pull': {collect: {shop_id: shop_id}}}).then(() => {
                            console.log('已删除收藏')
                            res.json({success: false, message: '已删除收藏!'})
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }
            })
        }

    })

}


//给商品点赞的行为
exports.postSatisfactionShop = (req,res,next)=>{
    //获取当前商品的id
    let shop_id = req.params.id;
    // console.log(shop_id)
    //获取当前收藏人的id
    let user_id = req.session.user._id
    // console.log(user_id)
    Shop.findOne({'_id':shop_id}).populate('author').exec(function(err,shop){
        if(err){
            res.end(err)
        }else{
            //判断一下。如果该用户已经收藏过该商品，则不能重复收藏
            let satisfaction = {
                userName:shop.author.name,
                shopName:shop.shopname,
                shop_id:shop_id
            }
            User.findOne({'_id':user_id},function(err,user){
                // console.log(user)
                // console.log(user.collect == '')
                    // console.log(561)
                    user.satisfaction.push(satisfaction)
                    // console.log(user);
                    //用户信誉值+1
                    user.reputation += 1;
                    user.save()
                    res.json({success:true,message:'点赞成功!'})
                    console.log('点赞成功!')
            })
        }

    })
}
//给商品取消点赞的行为
exports.deletepostSatisfactionShop = (req,res,next)=>{
    // console.log(79)
    //获取当前商品的id
    let shop_id = req.params.id;
    // console.log(shop_id)
    //获取当前收藏人的id
    let user_id = req.session.user._id
    // console.log(user_id)
    Shop.findOne({'_id':shop_id}).populate('author').exec(function(err,shop){
        if(err){
            res.end(err)
        }else{
            //判断一下。如果该用户已经收藏过该商品，则不能重复收藏
            // console.log(shop.author.name)
            User.findOne({'_id':user_id},function(err,user){
                // console.log(user)
                // console.log(11)
                for(let i=0;i<user.satisfaction.length;i++){
                    if(user.satisfaction[i].userName == shop.author.name){
                        User.update({'_id':user_id},{'$pull':{satisfaction:{userName:shop.author.name}}}).then(()=>{

                            //用户信誉值+1
                            user.reputation -= 1;
                            res.json({success:false,message:'已取消点赞!'})
                            console.log('已取消点赞')
                        }).catch(err=>{
                            console.log(err)
                        })
                    }
                }
            })
        }

    })
}
exports.cartList = (req,res,next)=>{
    /*res.render('cart',{
        title:'cartList',
        layout:'indexTemplate'
    })*/
}

//编辑问题的处理函数
exports.indexEdit = (req,res,next)=>{
    var shop_id = req.params.id;
    Shop.getArticle(shop_id,(err,shop)=>{
        console.log(1)
        if(!shop){
            return res.render('error',{
                message:'此商品不存在或已被删除',
                error:''
            })
        }
        if(String(shop.author._id) === String(req.session.user._id)){
            return res.render('shop_edit',{
                title:'编辑--商铺',
                layout:'indexTemplate',
                categorys:setting.categorys,
                shop:shop,
                resource:mapping.shop
            })
        }else{
            res.render('error',{
                message:'对不起，你没有权限编辑此商品',
                error:''
            })
        }
    })
}
//编辑行为的处理函数
exports.indexPostEdit = (req,res,next)=>{
    //商品的分类
    let category = validator.trim(req.body.category);
    //商品的名称
    let shopname = validator.trim(req.body.shopname)
    //商品的描述
    let describe = validator.trim(req.body.describe)
    //商品的价格
    let price = validator.trim(req.body.price);
    //商品的实物图
    let pictures = req.body.pictures;
    let shop_id = req.params.id
    //检测文章是否存在或者deleted状态为false;
    Shop.getQuestion(shop_id,(err,shop)=>{
        if(!shop){
            return end('此话题不存在或者已被删除')
        }
        if(String(shop.author._id) === String(req.session.user._id)){
            let error;
            //获取所有的分类
            const  allTabs = setting.categorys.map(function (tPair) {
                return tPair[0]
            });
            if(!validator.isLength(shopname,{min:1,max:50})){
                error = '文章的标题长度不能少于1个字符或者多于50个字符'
            }
            if(!validator.isLength(describe,{min:1,max:30})){
                error = '商品的描述多的超出了显示屏!'
            }
            if(!validator.isLength(price,{min:1,max:20})){
                error = '唔...手滑?'
            }
            if(!validator.isLength('pictures',0)){
                error = '实物图地址不能为空'
            }
            if(!validator.isLength(weight,{min:1,max:20})){
                error = '超重!'
            }
            if(error) {
                res.end(error);
            }else{
                shop.shopname = shopname;
                shop.describe = describe;
                shop.category = category;
                shop.price = price;
                shop.pictures = pictures;
                shop.update_time = new Date();
                shop.save().then((shop)=>{
                    at.sendMessageToMentionUsers(describe,shop._id,req.session.user._id);
                    return res.json({url:`/shop/${shop._id}`});
                }).catch(err=>{
                    return res.end(err);
                })
            }
        }else{
            return res.end('此商品您不具备编辑能力');
        }
    })
}
//删除行为的处理函数
exports.indexDelete = (req,res,next)=>{
    let question_id = req.params.id
    Shop.getNullQuestion(question_id,(err,message,question)=>{
        if(err){
            return res.json({success:false,message:err})
        }
        if(message !== ''){
            return res.json({success:false,message:message})
        }
        //判断下有无权限
        if(String(question.author._id) === String(req.session.user._id)){
            //文章的作者积分和回复量减少
            question.author.score -= 2;
            question.author.question_count -= 1;
            console.log(12313)
            //文章的状态为删除状态
            question.deleted = true;
            // console.log(question.deleted)
            question.save().then(question=>{
                // console.log(question)
                return res.json({success:true,message:'删除成功'})
            }).catch(err=>{
                return res.json({success:false,message:err});
            })
        }else{
            return res.json({success:false,message:'您没有权限进行删除'})
        }
    })
}

//添加商品到购物车 ××××××××××××
exports.postShopingList = (req,res,next)=>{
    //获取要购买商品的id
    let shop_id = req.params.id;
    // console.log(shop_id)
    //获取订单人
    let cart_name = req.session.user._id
    //根据id查询Shop表，找出购物车需要显示的数据
    Shop.findOne({'_id':shop_id}).populate('author').exec(function(err,shop){
        if(err){
            res.end(err)
        }
        // console.log(shop);
        //判断一下,如果购物车表中已有当前用户创建的订单。则将当前商品添加到购物车所含商品数组中。
        // 否则的话，新建一个购物车订单.
        let cart_shop = {
            //商品的作者
            userName: shop.author.name,
            //商品的name
            shopName: shop.shopname,
            //商品的id
            shop_id: shop._id,
            //商品的价格
            shop_price:shop.price,
            //实物图
            shop_pictures:shop.pictures
        }
        Cart.findOne({'cart_name':cart_name,'deleted':false}).then(cart=>{
            // console.log(cart == '')
            // console.log(cart)
            if(cart == null){
                // console.log(123)
                let newCart = new Cart()
                newCart.cart_shop.push(cart_shop);
                newCart.cart_name = cart_name;
                // console.log(newCart)
                newCart.save()
                res.json({success:true,message:'成功添加!'})
            }else{
                for(var i=0;i<cart.length;i++){
                    if(cart.cart_name[i] == cart_name){
                        cart.cart_shop.push(shop._id)
                        cart.save()
                    } else{
                        let newCart = new Cart()
                        newCart.cart_shop.push(cart_shop);
                        newCart.cart_name = cart_name;
                        // console.log(newCart)
                        newCart.save()
                        res.json({success:true,message:'成功添加!'})
                    }
                }
                
            }
            //将这个加入购物车的商品发布者积分增加/消息提示

        })

    })
}


//条件查询
//时间倒叙
exports.findConditionTimeIn = (req,res,next)=>{
    Shop.find({'deleted':false}).sort({'create_time':-1}).exec(function(err,shop){
        console.log(shop)
    })
}
//时间正序

