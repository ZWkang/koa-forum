let nodemailer = require('nodemailer')
let log = require('../utils/log.js')
let emailoption = {
  service: 'Gmail',  
  auth: {  
    user: 'kang95630@gmail.com',  
    pass: '**' //授权码
  }
};
let transporter = nodemailer.createTransport(emailoption);


var mailOptions = {  
    from: '你的动感地带<'+emailoption.auth.user+'>', // 发送者  
    to: 'adsasds<907747874@qq.com>', // 接受者,可以同时发送多个,以逗号隔开  
    subject: 'nodemailer2.5.0邮件发送', // 标题  
    text: 'Hello world' // 文本  
    // html: `<h2>nodemailer基本使用:</h2><h3></a></h3>`
};  

// module.export={
//     sending
// }

log.info('邮箱功能启动')
module.exports={
    send: function(option){
        option = JSON.parse(JSON.stringify(option))
        option['to'] = option&&option.to||'kangkang<907747874@qq.com>'
        option['subject'] = option&&option.subject||'注册信息'
        option['text'] = option&&option.text||''
        option['html'] = option&&option.html||''

        transporter.sendMail(option, function (err, info) {  
            if (err) {  
                throw new TypeError(err);
                return;
            }
            log.info('验证发送成功');  
        });
    }
}
