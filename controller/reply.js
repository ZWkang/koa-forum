const log = require('../utils/log.js')
let replyM = require('../models/index.js').reply;
let articleM = require('../models/index.js').article;
const jwt = require('../utils/token')

let replyAddAction = async function (ctx, next) {
    const body = ctx.request.body;

    let token, userid, replyid;
    token = ctx._tokens

    let article_id = ctx.params.id || '';
    if (article_id === '') {
        // ctx.body={
        //     success:false,
        //     errormessage:'参数错误'
        // }
        return ctx.throw(400, 'error params')
    }
    try {
        let result = await articleM.find({ article_id });
        if (result.length === 0) {
            // ctx.body={
            //     success:false,
            //     errormessage:'没有这个文章'
            // }
            // return ctx.throw(400,`article id is error`)
            throw new Error('article id is error')
        }
    } catch (e) {
        return ctx.throw(400, 'article is error')
    }

    let user_id = token._id;
    let reply_parent_id = body['reply_id'] || '';
    let reply_content = body['reply_content'] || '';
    let reply_time = new Date().toLocaleString();

    let obj = {
        reply_parent_id,
        reply_content,
        article_id,
        reply_time,
        user_id
    };
    let replys;
    let ReplyAddResult;
    try {
        ReplyAddResult = await replyM.create(obj)
        replys = await replyM.find({ 'article_id': article_id });
        await articleM.update({ '_id': article_id }, { $set: { "reply_count": replys.length } })
    } catch (e) {
        log.error(e)
        // return ctx.body = {
        //     success:false,
        //     errormessage: '新增评论失败'
        // }
        return ctx.throw('add reply error')
    }


    return ctx.body = {
        success: true,
        'reply_id': ReplyAddResult._id
    }
}

let replyDeleteAction = async function (ctx, next) {
    const body = ctx.request.headers;
    // console.log(headers)
    let token, userid, replyid;
    token = ctx._tokens || ''
    let _id = ctx.params.id || '';

    if (_id === '') {
        // return ctx.body={
        //     success:false,
        //     errormessage:'参数错误'
        // }    
        return ctx.throw(400, 'params is error');
    }
    let user_id = token._id;


    let obj = {
        user_id,
        _id
    };

    let result, idd, DeleteReplyResult
    try {
        result = await replyM.findOne({ _id })
        idd = result.article_id

        await articleM.update({ '_id': idd }, { $inc: { reply_count: -1 } })
        DeleteReplyResult = await replyM.remove(obj)
        log.info(DeleteReplyResult)
        return ctx.body = {
            success: true,
            DeleteReplyResult
        }
    } catch (e) {
        log.error(e);
        // return ctx.body = {
        //     success:false,
        //     errormessage: '删除评论失败'
        // }
        return ctx.throw(400, 'delete reply is error');
    }


}

module.exports = {
    replyAddAction,
    replyDeleteAction
}