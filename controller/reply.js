const log = require('../utils/log.js')
let replyM = require('../models/index.js').reply;
let articleM = require('../models/index.js').article;
const jwt = require('../utils/token')

let replyAddAction = async function(ctx,next){
    const body = ctx.request.body;
    // console.log(headers)
    let token,userid,replyid;
    try{
        token = body['authorization'];
        // console.log(token)
        token = jwt.verify(token);
        // console.log(token)
    }catch(err){
        return ctx.response.status = 401;
    }
    if(!token){
        return ctx.response.status = 401;
    }


    let article_id = ctx.params.id||'';
    if(article_id===''){
        ctx.body={
            success:false,
            errormessage:'参数错误'
        }
    }
    
    let result = await articleM.find({article_id});
    if(result.length===0){
        ctx.body={
            success:false,
            errormessage:'没有这个文章'
        }
    }
    let user_id = token._id;
    let reply_parent_id = body['reply_id']||'';
    let reply_content = body['reply_content']||'';
    let reply_time = new Date().toLocaleString();
    let obj={
        reply_parent_id,
        reply_content,
        article_id,
        reply_time,
        user_id
    };
    let replys;
    try{
         ss= await replyM.create(obj)
         replys = await replyM.find({'article_id':article_id});
         await articleM.update({'_id':article_id},{$set:{"reply_count":replys.length}})
    }catch(e){
        log.error(e)
        return ctx.body = {
            success:false,
            errormessage: '新增评论失败'
        }
    }
    

    return ctx.body={
        success:false,
        'reply_id':ss._id
    }
}

let replyDeleteAction = async function(ctx,next){
    const body = ctx.request.headers;
    // console.log(headers)
    let token,userid,replyid;
    try{
        token = body['authorization'];
        // console.log(token)
        token = jwt.verify(token);
        // console.log(token)
    }catch(err){
        return ctx.response.status = 401;
    }
    if(!token){
        return ctx.response.status = 401;
    }
    let _id = ctx.params.id||'';

    if(_id===''){
        return ctx.body={
            success:false,
            errormessage:'参数错误'
        }    
    }
    let user_id = token._id;


    let obj={
        user_id,
        _id
    };
    let result,idd
    try{
         result = await replyM.findOne({_id})
         idd = result.article_id
         console.log(idd)
         await articleM.update({'_id':idd},{$inc:{reply_count:-1}})
         ss= await replyM.remove(obj)

    }catch(e){
        console.log(e)
        return ctx.body = {
            success:false,
            errormessage: '删除评论失败'
        }
    }

    return ctx.body={
        success:true,
        ss
    }
}


module.exports = {
    replyAddAction,
    replyDeleteAction
}