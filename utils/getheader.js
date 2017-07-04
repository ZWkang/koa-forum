const jwt = require('./token.js')
const route = require('./routercheck.js')

let jwtcheck = function (opt){
    if(Object.prototype.toString.call(opt)!=='[object Object]'){
        throw new TypeError('you are enter a error type option')
    }
    opt = opt||{}
    let str ;
    if(!!opt['forget']){
        str = '^/'
    }else{
        str = '^'
    }
    return async function (ctx,next){
        const headers = ctx.request.headers
        let token
        const hostname = ctx.request.hostname
        let url = ctx.request.url
        
        for (let i of route){
            if((new RegExp(str+i)).test(url)){
                return next()
            }
        }
        try{
            token = headers['authorization']
            token = jwt.verify(token)
            ctx._tokens = token
        }catch(err){
            ctx.response.status = 401;
            ctx.response.message = opt['message']||''
        }
        if(!token){
            ctx.response.status = 401
            ctx.response.message = opt['message']||''
        }
        return next()
    }
}
module.exports = jwtcheck