const log = require('../utils/log.js')
let articleM = require('../models/index.js').article;
let replyM = require('../models/index.js').reply;
let starM = require('../models/index.js').star;
let userM = require('../models/index.js').koauser;

let collectionM = require('../models/index.js').collection;
const jwt = require('../utils/token.js')
const jwtcheck = require('../utils/getheader.js')


let articleGetAction = async function (ctx,next){
    const body = ctx.request.body;
    // console.log(headers)
    let token,userid,replyid;
    let _id = ctx.params.id||''
    if(_id==''){
        return ctx.body={
            success:false
        }
    }
    let flag = false;
    
    token = ctx._tokens;
    // console.log(token)
    if(token){
        flag = true
    }else{
        flag = true
    }
    let result = await articleM.findById(_id);
    result = JSON.parse(JSON.stringify(result))
    let replies ;
    // const body = ctx.request.body;
    try{
        if(result.length!==0){
            await articleM.update({_id},{$inc:{"acticle_read_times":1}})
            replies = await replyM.find({'article_id':_id}).sort({'reply_time':1}).exec()
            // console.log(result['user_id'])
            let cache = await userM.findOne({'_id':result['user_id']},{'user_name':1})
            // result['author_name'] = cache['user_name']
            
            result['author_name'] = cache['user_name']
            // console.log(result)
            replies = JSON.parse(JSON.stringify(replies))
            // console.log(result)
            for(let i=0;i<replies.length;i++){
                
                let cache = await userM.findOne({'_id':replies[i]['user_id']},{'user_name':1})
                // result['author_name'] = cache['user_name']
                
                replies[i]['author_name'] = cache['user_name']
            }
        }
        replies = JSON.parse(JSON.stringify(replies))
        result = JSON.parse(JSON.stringify(result))
        if(flag){
            for(let i = 0;i<replies.length;i++){
                let ss = await starM.find({'_id':replies[i]['_id'],'user_id':token._id})
                if(ss.length !=0){
                    replies[i]['is_uped'] = true;
                }else{
                    replies[i]['is_uped'] = false;
                }
            }
            let coll = await collectionM.find({'article_id':_id,'user_id':token._id});
            if(coll.length===1){
                result['is_collect'] = true;
            }else{
                result['is_collect'] = false;
            }
        }
    // console.log(replies)
    }catch(e){
        log.error(e);
        return ctx.body={
            success:false
        }
    }

    // console.log(result)
    return ctx.body = {
        success:true,
        article:result,
        replies:replies
    }

}

let articlePostAction = async function (ctx,next){
    const body = ctx.request.body;
    // console.log(body)
    let token,userid,replyid;
    token = ctx._tokens
    // return ctx.body={'hahahah':'123'}
    let obj = {};
    // console.log(token._id)
    obj['user_id'] = token._id;
    obj['reply_count'] = 0;
    obj['article_modifine_time'] = obj['article_time'] = new Date().toLocaleString();
    obj['article_title'] = ctx.request.body.title||'';
    obj['article_content'] = ctx.request.body.content||'';
    obj['article_tags'] = ctx.request.body.tags||[];
    obj['tab'] = ctx.request.body.tab||'share';
    obj['acticle_read_times'] = 0;
    obj['is_good'] = false;
    obj['is_top'] = false;
    let ss
    if( obj['article_title']===''||obj['article_content']===''){
        ctx.response.status=500;
    }

    try{
         ss= await articleM.create(obj)
        return ctx.body={
            success:true,
            article_id:ss._id
        }
    }catch(e){
           log.error(e)
        return ctx.body = {
            success:false,
            errormessage: '新增失败'
        }
    }

    
}
let articleDeleteAction = async function (ctx,next){
    const body = ctx.request.headers;
    const article_id = ctx.params.id||'';
    if(article_id===''){
        return ctx.body={
            success:false,
            errormessage:'检查id参数'
        }
    }
    let token,userid,replyid;
    token = ctx._tokens

    try{
        let ss = await userM.findOne({'_id':token._id})
        let ee = await articleM.find({'_id':article_id,'user_id':token._id})
        if(ss['is_admin']||ee.length>0){
            let result = await articleM.remove({'_id':article_id,'user_id':token._id})
            if(result['result']['ok']&&result['result']['n']){
                return ctx.body={
                    success:true
                }
            }
        }else{
            return ctx.response.status = 401;
        }
    }catch(e){
        console.log(e)
        return ctx.body={
            success:false,
            errormessage:'删除失败'
        }
    }
    return ctx.body={
        success:true
    }
}
let articlePutAction = async function (ctx,next){
    const body = ctx.request.body;
    let token,userid,replyid;
    token = ctx._tokens
    let _id = ctx.params.id||'';
    if(_id===''){
        return ctx.body={
            success:false,
            errormessage: '参数错误'
        }
    }
    
    

    // let obj = {};
    // obj['user_id'] = token._id;

    // obj['article_modifine_time'] = new Date().toLocaleString();
    // obj['arctile_title'] = ctx.request.body.title||'';
    // obj['article_content'] = ctx.request.body.content||'';
    // obj['article_tags'] = ctx.request.body.tags||[];
    // obj['tab'] = ctx.request.body.tab||'share';
    // obj['is_good'] = false;
    // obj['is_top'] = false;
    let obj = {
        user_id:token._id,
        article_modifine_time:new Date().toLocaleString(),
        article_title:body.title||'',
        article_content:body.content||'',
        article_tags:body.tags||'',
        tab:body.tab||'share',
        is_good:false,
        is_top:false
    }
    let result
    let ss
    try{
        result = await articleM.findOne({_id});
        if(result['user_id']===obj['user_id']){
            ss= await articleM.update({'_id':_id},obj)
        }
    }catch(e){
        // log.error(e)
        //    console.log(e)
        return ctx.body = {
            success:false,
            errormessage: '更新失败'
        }
    }
    return ctx.body={
        success:true,
        'topid':_id
    }
}

module.exports = {
    articlePostAction,
    articleGetAction,
    articlePutAction,
    articleDeleteAction
}