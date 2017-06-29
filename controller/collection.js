const log = require('../utils/log.js')
let collection = require('../models/index.js').collection;
let articleM = require('../models/index.js').article;
const jwt = require('../utils/token.js')


let collectionAddAction = async function(ctx,next){
    const body = ctx.request.body;
    // log.info(body)
    let token,userid,replyid;
    // console.log(body['authorization'])
    try{
        token = body['authorization'];
        // console.log(token)
        token = jwt.verify(token);
        // console.log(token)
    }catch(err){
        // console.log(err)
        log.error(err)
        return ctx.response.status = 401;
    }
    if(!token){
        return ctx.response.status = 401;
    }

    

    let article_id = ctx.params.id||'';
    try{
        let result = await articleM.find({'_id':article_id})
        // console.log(result)
        if(result.length==0){
            return ctx.body={
                success:false,
                errormessage:'目标文章不存在'
            }
        }
    }catch(e){
        log.error(e);
        return ctx.body={
            success:false,
            errormessage:'收藏失败'
        }
    }
    let user_id = token._id
    let collect_time = new Date().toLocaleString();
    let obj = {
        article_id,
        user_id,
        collect_time
    }

    

    try{
        let colresu = await collection.find({article_id,user_id});
        if(colresu.length>0){
            return ctx.body = {
                success:false,
                errormessage:'已经收藏了'
            }
        }
        let suc = await collection.create(obj);
        
        return ctx.body={
            success:true
        }
    }catch(e){
        log.error(e);
        return ctx.body={
            success:false,
            errormessage:'收藏失败'
        }
    }
}

let collectionCancelAction = async function(ctx,next){
    const body = ctx.request.headers;
    // log.info(body)
    // console.log(123123)
    let token,userid,replyid;
    console.log(body['authorization'])
    try{
        token = body['authorization'];
        // console.log(token)
        token = jwt.verify(token);
        // console.log(token)
    }catch(err){
        console.log(err)
        return ctx.response.status = 401;
    }
    if(!token){
        return ctx.response.status = 401;
    }



    let article_id = ctx.params.id||'';
    try{
        let result = await articleM.find({'_id':article_id})
        if(result.length==0){
            return ctx.body={
                success:false,
                errormessage:'目标文章不存在'
            }
        }
    }catch(e){
        log.error(e);
        return ctx.body={
            success:false,
            errormessage:'收藏失败'
        }
    }
    let user_id = token._id
    let obj = {
        article_id,
        user_id
    }
    try{
        let suc = await collection.remove(obj);
        if(suc['result']['ok']&&suc['result']['n']){
            return ctx.body={
                success:true
            }
        }
        return ctx.body={
            success:false
        }
    }catch(e){
        log.error(e);
        return ctx.body={
            success:false,
            errormessage:'收藏失败'
        }
    }
}

let collectionShowAction = async function(ctx,next){
    // console.log(ctx.request.query)
    // const body = ctx.request.query;
    // log.info(body)
    let token,userid,replyid;
    // try{
    //     token = body['token'];
    //     // console.log(token)
    //     token = jwt.verify(token);
    //     // console.log(token)
    // }catch(err){
    //     return ctx.response.status = 401;
    // }
    // if(!token){
    //     return ctx.response.status = 401;
    // }

    // let _id = token._id;
    let _id = ctx.params.id||'';
    try {
        let result = await collection.find({'user_id': _id});
        result = JSON.parse(JSON.stringify(result));
        let ss
        
        for(let i=0;i<result.length;i++){
            result[i]['articlemsg'] = await articleM.find({'_id':result[i]['article_id']})
        }
        
        return ctx.body = {
            success:true,
            result
        }
        
    } catch (error) {
        log.error(error)
        return ctx.body = {
            success:false,
            errormessage:'获取失败'
        }
    }


}

// let collectionwho = async function(ctx,next){
//     // return ctx.redirect('/login');
//     // const body = ctx.request.body;
//     // console.log(ctx.response.is.toString())
//     return ctx.body = {
//         // header:ctx.request.accept,
//         headers:ctx.request.headers,
//         ressss:ctx.response
//     }
    
// }

let collectionwho = async function(ctx,next){
    return ctx.body = {
        status:ctx.method,
        header:ctx.request.headers
    }
}



module.exports = {
    collectionAddAction,
    collectionCancelAction,
    collectionShowAction,
    collectionwho
}