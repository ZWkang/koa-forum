const log = require('../utils/log.js')
let koauser = require('../models/index.js').koauser;
const crypto = require('crypto');
const jwt = require('../utils/token.js')
const sendmail = require('../mail/index.js')


let registerAction = async function(ctx,next){
    const user_name = ctx.request.body.username||''
    const user_password = ctx.request.body.password||''
    const user_email = ctx.request.body.email||''

    let md5sum = crypto.createHash('md5');
    
    try{
        let user_register_time = Date('Y-m-d');
        md5sum.update(user_name+'kangkang'+user_register_time);
        let user_active = md5sum.digest('hex');

        let user_last_login_time = user_register_time;
        let obj = {
            'user_name':user_name,
            'user_password':user_password,
            'user_email':user_email,
            'user_active':user_active,
            'user_register_time':user_register_time,
            'user_last_login_time':user_last_login_time,
            'is_admin':true
        }

        var body = {};

        sendmail.send({
                        'to':user_email,
                        'html':'<a href="http://172.16.144.40:8000/verifykey/?key'+user_active+'">点击此处验证邮箱</a>',
                        'text':'验证邮箱信息点击'
                    })
        let ress
        try{
            let ress = await koauser.create(obj)
            return ctx.body={
                success:true,
                loginname:ress.user_name,
                id:ress._id,
                token:jwt.sign({'_id':ress._id})
            }
        }catch(e){
            log.error(e)
            return ctx.body = {
                success:false,
                errormessage: '注册失败'
            }
        }


    }catch(e){
        log.error(e)
        return ctx.body = {
            success:false,
            errormessage: '注册失败'
        }
    }


}

let be_active = async function(ctx,next){

    const body = ctx.request&&ctx.request.body
    let active_value = body['active']||''
    if(!active_value){
        throw new TypeError('')
        ctx.body = {
            success:false,
            errormessage:'active值为空'
        }
        return next();
    }
    let result
    try{
        result = await koauser.find({"user_active":active_value})
        if(result.lengt<0||(result[0]&&result[0]["user_active"]!=='')||result[0]['user_active']!==active_value){
            ctx.body = {
                success:false,
                errormessage:'active值有误'
            }
            return next()
        }
        userM.update({"user_active":active_value},{$set:{"user_active":''}})
        ctx.body = {
            success:true
        }
    }catch(e){
         log.error(e)
         return next();
    }
    return next()
}

module.exports={
    registerAction
}