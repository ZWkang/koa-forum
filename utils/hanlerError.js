const log = require('./log.js')

const HandlerError = function(){
    return async function(ctx,next){
        try{
            await next()
        }catch(e){
            // console.log(e.status,e.message)
            log.error(e.message)
            
                        
            ctx.status = e.status||400
            ctx.response.type = 'application/json'
            ctx.response.body = {
                code: e.status||400,
                message: e.message||'error '
            }
            
        }
    }
}

module.exports = HandlerError