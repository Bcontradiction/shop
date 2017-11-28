/**
 * Created by Administrator on 2017/11/8.
 */
//收货地址
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseModel = require('./base_model');
const shortid = require('shortid');
const LocationSchema = new Schema({
    //地址的id
    _id:{
        type:String,
        default:shortid.generate,
        unique:true
    },
    //创建收货地址的用户
    user_id:{
        type:String,
        require:true,
        ref:'User'
    },
    //收货人
    name:{
        type:String,
        require:true
    },
    //收货地址
    url:{
        type:String,
        require:true
    },
    //收货人手机号
    tel:{
        type:Number,
        require:true
    }/*,
    //固定电话
    location_tel:{
        type:Number,
        require:true
    }*/,
    //是否删除
    deleted:{
        type:Boolean,
        default:false
    },
    //是否为默认地址
    is_activate:{
        type:Boolean,
        default:false
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
    }
})


LocationSchema.plugin(BaseModel);
const Location = mongoose.model('Location',LocationSchema);
module.exports = Location
