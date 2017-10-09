const log = require('../utils/log.js')
let collection = require('../models/index.js').collection;
let articleM = require('../models/index.js').article;
const jwt = require('../utils/token.js')


let collectionAddAction = async function(ctx,next){
    const body = ctx.request.body;
    let token,userid,replyid;
    token = ctx._tokens

    let article_id = ctx.params.id||'';
    // console.log(article_id)
    try{
        let result = await articleM.find({'_id':article_id})
        if(result.length==0){
            // return ctx.body={
            //     success:false,
            //     errormessage:'目标文章不存在'
            // }
            return ctx.throw(400,`目标文章不存在`)
        }
    }catch(e){
        log.error(e);
        // console.log(e);
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
            // ctx.status = 400
            // ctx.body = {
            //     success:false,
            //     errormessage:'已经收藏了'
            // }
            return ctx.throw(400,'error !! you already collection this article')
        }
        let suc = await collection.create(obj);
        
        return ctx.body={
            success:true,
            message:'收藏成功'
        }
    }catch(e){
        log.error(e);
        
        // return ctx.body={
        //     success:false,
        //     errormessage:'收藏失败'
        // }
        return ctx.throw(400,'收藏失败')
    }
}

let collectionCancelAction = async function(ctx,next){
    const body = ctx.request.headers;

    let token,userid,replyid;
    // console.log(body['authorization'])
    token = ctx._tokens



    let article_id = ctx.params.id||'';
    try{
        let articleResult = await articleM.find({'_id':article_id})
        if(articleResult.length==0){
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
        let removeSuccessStatus = await collection.remove(obj);
        if(removeSuccessStatus['result']['ok']&&removeSuccessStatus['result']['n']){
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
        let collectionResult = await collection.find({'user_id': _id});
        collectionResult = JSON.parse(JSON.stringify(collectionResult));
        let ss
        
        for(let i=0;i<collectionResult.length;i++){
            collectionResult[i]['articlemsg'] = await articleM.find({'_id':collectionResult[i]['article_id']})
        }
        
        return ctx.body = {
            success:true,
            collectionResult
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