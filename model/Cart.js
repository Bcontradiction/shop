/**
 * Created by hama on 2017/9/18.
 */
//二级回复表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//将基础的方法引入进来
const BaseModel = require('./base_model');
const shortid = require('shortid');
const CartSchema = new Schema({
    //购物车的id
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //购物车创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    //购物车修改时间
    update_time:{
        type:Date,
        default:Date.now
    },
    //购物车所含的商品
    cart_shop:[{
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
        //商品的价格
        shop_price:Number,
        //实物图
        shop_pictures:String,
        //多少件
        shop_num:{
            type:Number,
            default: 1
        },
        //单种总价
        goods_price:{
            type:Number,
            default: 0
        }
    }],
    //购物车总价
    cart_price:{
        type:Number,
        default:0
    },
    //订单号 购物车id+修改时间/创建时间
    orderid:{
        type:String,
        unique:true,
    },
    //创建购物车的用户
    cart_name:{
        type:String,
        require:true,
        ref:'User'
    },
    //增加删除功能
    deleted:{
        type:Boolean,
        default:false
    }
})
//当前的模型就会有BaseModel里面的方法了.
CartSchema.statics = {

}
CartSchema.plugin(BaseModel);
const Cart = mongoose.model('Cart',CartSchema);
module.exports = Cart
