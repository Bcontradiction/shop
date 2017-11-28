/**
 * Created by hama on 2017/9/25.
 */
const nodemailer = require('nodemailer');
const setting = require('../setting');
const User = require('../model/User')
const mail = {
    sendEmail:(type,regMsg, user, callback)=>{
        let name = regMsg.name;//要发送邮箱的用户名
        let email = regMsg.email;//要发送邮箱的地址
        //1.创建SMTP服务
        let transporter = nodemailer.createTransport({
            service:'163',
            auth:{
                user:'ll24120494@163.com',
                pass:'c158998674'
            }
        })
        console.log(email)
        //这时候账号密码已经存到数据库当中了，查到它
        User.findOne({"email": "email"}).then(user=>{
            console.log(user)
            let id = user._id
            console.log(id)
            //2.设置邮箱的默认格式
            let mailOptions = {
                from:setting.mail_opts.auth.user,
                to:email,
                subject:`恭喜${setting.mail_opts.auth.user}注册社区系统成功`,
                text:`${name}你好`,
                html:`<b>您已经注册成功，请点击<a href="http://localhost:8888/is_active + 'id'"}>这里</a>激活账号</b>`
            }
            transporter.sendMail(mailOptions,(error,info)=>{
                if(error){
                    callback(error);
                }
                callback(info);
            })
        })

    }
}
module.exports = mail