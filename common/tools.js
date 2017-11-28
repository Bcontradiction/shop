/**
 * Created by hama on 2017/6/1.
 */
//日期格式化插件引入
const  moment = require('moment');
moment.locale('zh-cn');//中文
exports.formatDate  = (date,friendly)=>{
    date = moment(date);
    console.log(date);
    if(friendly){
        return date.fromNow()
    }else{
        return date.format('YYYY-MM-DD  HH:MM')
    }
}