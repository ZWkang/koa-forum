


let headerget = function (ctx,next){
    const headers = ctx.request.headers;
    let token,userid,replyid;
    try{
        token = headers['authorization'];
        token = jwt.verify(token);
    }catch(err){
        return ctx.response.status = 401;
    }
    if(!token){
        return ctx.response.status = 401;
    }
    return token
}

module.exports = headerget