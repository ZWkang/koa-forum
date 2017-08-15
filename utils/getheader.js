const jwt = require('./token.js')
const route = require('./routercheck.js')
// const jwt = require('jsonwebtoken')

let jwtcheck = function (opt){
    opt = opt||{}
    if(Object.prototype.toString.call(opt)!=='[object Object]'){
        throw new TypeError('you are enter a error type option')
    }
    let str ,key;
    if(!!opt['forget']){
        str = '^/'
    }else{
        str = '^'
    }
    const defaultkey = ''
    key = !!opt['private_key']&&String(opt['private_key'])===opt['private_key']?opt['private_key']:'kangkang'
    let sign = function(obj){
        return jwt.sign(obj,key)
    }

    let verify = function (token){
        return jwt.verify(token,key);
    }
    return async function (ctx,next){
        const headers = ctx.request.headers
        let token
        const hostname = ctx.request.hostname
        const url = ctx.request.url
        
        for (let i of route){
            if((new RegExp(str+i)).test(url)){
                return next()
            }
        }
        try{
            token = headers['authorization']
            token = verify(token)
            ctx._tokens = token
        }catch(err){
            ctx.response.status = 401;
            ctx.response.message = opt['message']||''
        }
        if(!token){
            ctx.response.status = 401
            ctx.response.message = opt['message']||''
        }else{
            return next()
        }

        
    }
}
module.exports = jwtcheck