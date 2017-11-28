const Shop = require('../model/Shop');
const User = require('../model/User');
const Cart = require('../model/Cart')
const Order = require('../model/Order')
const Format = require('../common/util');
const _ = require('lodash')
//点击加入购物车
exports.postClickAddCart = (req,res,next)=>{
    let shop_id = req.params.id;
    let shop_num = req.body.shop_num
    // console.log(shop_num)
    let user_name = req.session.user.name
    // console.log(shop_id)
    // console.log(user_name)
    //根据商品id查出商品的信息
    //创建购物车的用户
    let cart_name;
    Shop.findOne({'_id':shop_id},{'deleted':false}).populate('author').exec(function(err,shop){
        if(err){
            res.end(err)
        }else{
            // console.log(151)
            if(shop_num == null){
                shop_num = 1;
            }
            cart_name = user_name
            // console.log(cart_name)
            let goods_price = parseInt((shop.price) * shop_num)
            let cart_shop = {
                userName:shop.author.name,
                shopName:shop.shopname,
                //商品的id
                shop_id: shop._id,
                //商品的价格
                shop_price:shop.price,
                shop_pictures:shop.pictures,
                shop_num:shop_num,
                goods_price:goods_price
            }
            //判断一下,如果当前用户已经创建过购物车，那么只将商品信息push到数组cart_shop中
            let newCart = new Cart();
            Cart.findOne({'cart_name':cart_name}).then(cart=>{
                if(cart != null){
                    // console.log(cart)
                    // console.log(cart_shop)
                    cart.cart_shop.push(cart_shop);
                    // console.log(cart)
                    //数组去重
                    _.union([cart.cart_shop])

                    cart.save().then(data=>{
                        res.json({success:true,message:'添加成功'})
                    })
                }else{
                    newCart.cart_name = cart_name;
                    newCart.cart_shop.push(cart_shop);
                    // console.log(newCart)
                    //数组去重
                    // console.log(cart.cart_shop)
                    newCart.save().then(data=>{
                        res.json({success:true,message:'添加成功'})
                    })
                }
            }).catch(err=>{
                console.log(err)
            })


        }
        // console.log(shop)
    })
}
exports.postClickPayment = (req,res,next)=>{
    let userId = req.session.user._id;
    let products = _.values(req.body);
    // console.log(req.body);
    // console.log(products);
    let productIds = [];
    let allPrice = null;
    //生成随机的底单号
    var platform = '622';
    var r1 = Math.floor(Math.random()*10);
    var r2 = Math.floor(Math.random()*10);
    // console.log(1313)
    var sysDate = Format('yyyyMMddhhmmss');
    var createDate = Format('yyyy-MM-dd hh:mm:ss');
    // console.log(7878)
    var orderId = platform+r1+sysDate+r2;
    //结束
    // console.log(sysDate+r2)
    let newOrder = new Order();
    newOrder.orderId = orderId;
    newOrder.author = userId;
    newOrder.address = [];
    products.forEach(function(product,index){
        let arr = {
            _id:product[0],
            name:product[1],
            picture:product[2],
            price:product[3],
            num:product[4],
            subtotal:product[5],
            is_finish:false
        };
        productIds.push(arr._id);
        quantity=product[6]//数量
        allPrice = product[7]//总价格
        newOrder.goodsList.push(arr)
    })
    productIds.forEach(function(one,index){
        // console.log(one)
        User.update({'_id':userId},{$pull:{myShop:{'_id':one}}}).then((data)=>{
            User.findOne({'_id':userId}).then(user=>{
                req.session.user = user;
            })
        })
    })
    newOrder.quantity = quantity;//数量
    newOrder.allPrice = allPrice;//总价格
    newOrder.createDate = createDate;//
    newOrder.save().then(()=>{
        res.json({
            status:'1',
            orderId:orderId
        })
    })
}
//删除选中的商品
exports.postClickDeleteCart = (req,res,next)=>{
    //获取被删除的商品的id


}

//订单号
exports.orderid = (req,res,next)=>{
    let orderid = req.body.orderid
    Order.findOne({'orderid':orderid}).exec(function(err,orderId){
        console.log(orderId)
        res.render('OrderID',{
            title:'订单号',
            layout:'indexTemplate',
            orderId:orderId
            // resource:mapping.register
        })
    })

}