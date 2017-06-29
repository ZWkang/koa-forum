let jwt = require('jsonwebtoken')
const key = 'kang-kang'
let sign = function(obj){
    return jwt.sign(obj,key,{
        expiresIn: 666666
    })
}

let verify = function (token){
    return jwt.verify(token,key);
}

module.exports={
    sign,
    verify
}