const log = require('../utils/log.js')
let koauser = require('../models/index.js').koauser;
const jwt = require('../utils/token.js')

//username
//password
let LoginAction = async function(ctx,next){
    
    let user_name = ctx.request.body.username||''
    let user_password = ctx.request.body.password||''
    if(user_name==''||user_password==''){
        return ctx.body={
            success:false,
            errormessage:'登录失败'
        }
    }
    let obj = {
        user_name,
        user_password
    }
    let result = await koauser.find(obj).exec();
    // console.log(result);
    log.info(result)
    if(result.length==0){
        return ctx.body={
            success:false,
            errormessage:'登录失败'
        }
    }
    return ctx.body={
        success:true,
        id:result[0]._id,
        loginname:result[0].user_name,
        tokens:jwt.sign({'_id':result[0]._id})
    }
}

module.exports={
    LoginAction
}