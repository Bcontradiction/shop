/**
 * Created by hama on 2017/9/18.
 */
//二级回复表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//将基础的方法引入进来
const BaseModel = require('./base_model');
const shortid = require('shortid');
const OrderSchema = new Schema({
    //订单的id
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //订单创建时间
    create_time:{
        type:Date,
        default:Date.now
    },
    /*//订单修改时间
    update_time:{
        type:Date,
        default:Date.now
    },*/
    //订单号
    orderId:{
        type:String,
        unique:true,
    },
    //发起人
    author:{
        type:String,
        ref:'User'
    },
    //地址
    address:{
        type:String,
        ref:'Location'
    },
    //商品信息
    goodsList:[{
        //商品的id
        _id: String,
        //商品的作者
        name: String,
        //商品的实物图
        picture: String,
        //商品的加个
        price:Number,
        //商品的数量
        num:Number,
        //单类商品的总价
        subtotal:String,
        //状态
        is_finish:false
    }],
    //总数量
    quantity:{
        type:Number,
        default:0
    },
    //总价格
    allPrice:{
        type:Number,
        default:0
    }
})
//当前的模型就会有BaseModel里面的方法了.
OrderSchema.statics = {

}
OrderSchema.plugin(BaseModel);
const Order = mongoose.model('Order',OrderSchema);
module.exports = Order
