let jwt = require('jsonwebtoken')
// const key = 'kang-kang'
const config = require('../config/index.js')

let key = config['PROJECT_KEY']||'kangkang'
let sign = function(obj){
    return jwt.sign(obj,key)
}

let verify = function (token){
    return jwt.verify(token,key);
}

module.exports={
    sign,
    verify
}