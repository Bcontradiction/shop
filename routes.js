/**
 * Created by Administrator on 2017/9/22.
 */
//路由文件
const express = require('express');
const router = express.Router();
//引入首页、登录还有注册的处理函数
const index = require('./routes/index');
//引入编辑页面和发起页面的处理函数
const shop = require('./routes/shop');
//用户个人设置，用户回复、用户列表、个人中心的处理函数
const user = require('./routes/user');
//购物车
const cart = require('./routes/cart')
//收货地址
const location = require('./routes/location');
//消息通知的处理函数
const message = require('./routes/message');
//引入一级回复的处理函数
const reply = require('./routes/reply');
//订单表
//引入二级回复的处理函数
const comment = require('./routes/comment');
//引入权限文件
const auth = require('./common/auth');
/********************index**********************/
//首页的路由
// router.get('/',index.indexHome);
//注册和登录的页面路由
router.get('/register',index.register);
//登录页面的路由
router.get('/login',index.login);
//注册的行为
router.post('/register',index.postRegister);
//登录行为
router.post('/login',index.postLogin);
//退出行为
router.get('/logout',index.logout);
//激活用户的页面
router.get('/is_active:id',index.active)
// *******************shop***********************!/
//索引的页面 发布商品 我的购物车
router.get('/index',user.indexes)
//编辑商品的页面
// router.get('/question/:id/edit',question.edit);
//编辑商品的行为
// router.post('/question/:id/edit',question.postEdit)
//发布商品的页面
router.get('/shop/add',shop.addShop);
//上传实物图的行为
router.post('/shop/updateImage',shop.addUpdateImage)
//发布商品的行为
router.post('/shop/add',shop.postAddShop);
//收藏商品的行为
router.post('/shop/:id/collect',shop.postCollectShop);
//从收藏删除的行为
router.post('/shop/:id/uncollect',shop.deleteCollectShop);
//点赞商品的行为
router.post('/shop/:id/satisfaction',shop.postSatisfactionShop);
//取消点赞的行为
router.post('/shop/:id/unsatisfaction',shop.deletepostSatisfactionShop);
//单个商品的详细信息页面
router.get('/shop/:id',shop.index);
//编辑商品的页面
router.get('/shop/:id/edit',shop.indexEdit);
//编辑商品的行为
router.post('/shop/:id/edit',shop.indexPostEdit);
//删除商品的行为
router.get('/shop/:id/delete',shop.indexDelete);
//全部商品的显示页面
router.get('/',shop.getShoping)
//购物车列表
router.get('/shoping-list/:id',shop.shopingList)
//添加商品搭配购物车的行为
router.post('/shoping-list/:id',shop.postShopingList)
//点击加入购物车
router.post('/shoping-clickAdd/:id',cart.postClickAddCart)
//清空购物车的行为
// router.post('/shoping-clickClear/:id',cart.postClickClearCart)
//删除购物车内商品的行为
router.post('/shoping-clickDeleteCart/:id',cart.postClickDeleteCart)
//付款的行为
router.post('/shoping-clickPayment/:id',cart.postClickPayment)
//打印订单号
router.get('/orderid/:orderid',cart.orderid)
//商铺的查询行为
router.post('/shop-findConditionTimeIn',shop.findConditionTimeIn)
// /!*********************user*************************!/
//个人设置的页面
router.get('/user-list',user.setting);
//更新头像
router.post('/updateImage',user.updateImage);
//更新个人资料
router.post('/updateUser/:id',user.updateUser);
//从收藏列表删除
router.post('/deleted/:id',user.deletedUserList)
//用户收藏的商品
router.get('/collect:id',user.collect)
//添加收货地址
router.post('/address',location.address)
//删除收货地址
router.post('/address/:id/delete',location.urlDeleted)
//编辑收货地址
//更改收货地址信息
router.post('/address/:id/edit',location.urlEdit)
//设置为默认地址
router.post('/address/:id/default',location.urlDefault)


//**************************************消息*************************************
//消息列表页面
router.get('/my/messages',auth.userRequired,message.index);
//确认已读行为
router.get('/updateMessage/:id',auth.userRequired,message.updateMessage);
//确认全部已读行为
router.get('/updateAllMessage',auth.userRequired,message.updateAllMessage);
//显示已读消息的分页
router.post('/showMessagesPage/:page',auth.userRequired,message.showMessagesPage);


//**************************************回复*************************************
router.post('/:shop_id/reply',auth.userRequired,reply.add);//一级回复
//一级回复的点赞行为
router.post('/:reply_id/likes',auth.userRequired,reply.likes);//一级回复
// router.post('/:shop_id/comment',auth.userRequired,comment.add)//二级回复
// router.get('/:reply_id/showComments',auth.userRequired,comment.show)//显示二级回复

// /!***********************消息***********************!/
//消息列表页面
// router.get('/my/messages',message.index);
//确认已读行为
// router.get('/updateMessage/:id',message.updateMessage);
//确认全部已读行为
// router.get('/updateAllMessage',message.updateMessage);



module.exports = router;
