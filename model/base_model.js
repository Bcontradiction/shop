/**
 * Created by Administrator on 2017/11/1.
 */
const tools = require('../common/tools')


module.exports = (schema)=>{
    schema.methods.create_time_ago = function () {
        return tools.formatDate(this.create_time,true);
    };
    schema.methods.update_time_ago = function (){
        return tools.formatDate(this.update_time,true);
    };
}