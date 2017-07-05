const log = require('../utils/log.js')
let articleM = require('../models/index.js').article;
let userM = require('../models/index.js').koauser;
let replyM = require('../models/index.js').reply;
const jwt = require('../utils/token.js')
const headerget = require('../utils/getheader.js')

let indexShowAction = async function(ctx,next){
    const query = ctx.request.query;
    
    let page = Number(query['page'])||1;
    let tab = query['tab']||'share';
    let limits = Number(query['limit'])||20;
    let usermsg
    
    try{
        let result 
        if(tab ==='all'){
            // console.log(tab)
            result = await articleM.find({}).skip((page-1)*limits).limit(limits)
        }else if(tab==='good'){
            result = await articleM.find({'is_good':true}).skip((page-1)*limits).limit(limits)
        }else{
            result = await articleM.find({tab}).skip((page-1)*limits).limit(limits)
        }
        console.log(result)
        for(let i =0;i<result.length;i++){
            usermsg = await userM.find({'_id':result[i]['user_id']},{'user_name':1})
            // console.log(usermsg)
            result[i]['user_name'] = usermsg['user_name']
        }
        return ctx.body={
            success:true,
            result:result
        }
    }catch(err){
        // console.log(err)
        log.error(err)
        return ctx.body={
            success:false
        }
    }
}

let searchAction = async function(ctx,next){
    const body = ctx.request.body;
    let query = body['key'];
    let searchkey = new RegExp(query);
    try{
        let result = await articleM.find({'article_title':searchkey});
        return ctx.body={
            success:true,
            result
        }
    }catch(e){
        log.error(e);
        return ctx.body={
            success:true,
            result:{}
        }
    }
}

let goodtoArticle = async function(ctx,next){
    const body = ctx.request.body;
    // console.log(headers)
    let token,userid,replyid;
    try{
        token = body['token'];
        // console.log(token)
        token = jwt.verify(token);
        // console.log(token)
        console.log(token)
    }catch(err){
        return ctx.response.status = 401;
    }
    if(!token){
        return ctx.response.status = 401;
    }

    let param = ctx.params.id||''
    
    let ss
    try{
        let result = await userM.find({'_id':token._id},{'is_admin':1})
        let isAdmin = result[0]['is_admin'];
        if(isAdmin){
            
            
            ss = await articleM.find({'_id':param,'is_good':false})
            if(ss.length>0){
                await articleM.update({'_id':param},{$set:{'is_good':true}})
                return ctx.body={
                    success:true,
                    'action':'down'
                }
            }else{
                await articleM.update({'_id':param},{$set:{'is_good':false}})
                return ctx.body={
                    success:true
                }
            }

        }else{
            return ctx.response.status=401;
        }
    }catch(e){
        log.error(e);
        return ctx.body={
            success:false
        }
    }
}

let uptoArticle = async function(){
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

    let param = ctx.param.id||''
    

    try{
        let result = await userM.find({'_id':token._id},{'is_admin':1})
        let isAdmin = result[0]['is_admin'];
        if(isAdmin){
            await articleM.update({'_id':param},{$set:{'is_up':true}})
            return ctx.body={
                success:true
            }
        }else{
            return ctx.response.status=401;
        }
    }catch(e){
        log.error(e);
        return ctx.body={
            success:false
        }
    }
}

let userinfo = async function(ctx,next){
    let user_id = ctx.params.id||''
    if(user_id===''){
        return ctx.body={
            success:false,
            errormessage:'id不为空'
        }
    }
    try {
        let result = await userM.findOne({'_id':user_id})
        result = JSON.parse(JSON.stringify(result))
        let ss = await articleM.find({'user_id':user_id});
        result['article'] = ss||[];
        ss = await replyM.find({'user_id':user_id})
        result['replies'] = ss||[];
        return ctx.body={
            success:true,
            result
        }
    } catch (error) {
        log.error(error)
        return ctx.body={
            success:false
        }
    }

}

module.exports = {
    indexShowAction,
    searchAction,
    goodtoArticle,
    uptoArticle,
    userinfo
}