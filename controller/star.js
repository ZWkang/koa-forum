const log = require('../utils/log.js')
const Star = require('../controller/star.js')
const jwt = require('../utils/token.js')

const replyM = require('../models/index.js').reply

const starM = require('../models/index.js').star

let starAction = async function(ctx,next){
    const body = ctx.request.body;
    let token,userid,replyid;
    token = ctx._tokens||''

    let reply_id = ctx.params.id||'';
    
    let user_id = token._id;
    let star_time = new Date().toLocaleString();

    if(reply_id===''){
        return ctx.body={
            success:false
        }
    }
    let obj = {
        reply_id,
        user_id,
        star_time
    }
    let replysearch
    let falg
    try{
        replysearch = await replyM.find({'_id':reply_id})
        if(replysearch.length !==0){
            flag = await starM.find({user_id,reply_id})
            if(flag.length===1){
                await starM.remove({user_id,reply_id})
                return ctx.body={
                    success:true,
                    "action":"down"
                }
            }else{
                await starM.create(obj)
                return ctx.body={
                    success:true,
                    "action":"up" 
                }
            }
        }

    }catch(e){
        return ctx.body={
            success:false,
            errormessage:'点赞失败'
        }
    }
}

module.exports = {
    starAction
}
