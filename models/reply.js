let mongoose = require('mongoose')

let Schema = mongoose.Schema

let replySchema = new Schema({
    reply_parent_id:{type:String,default:''},
    reply_content:{type:String},
    article_id:{type:String},
    reply_time:{type:String},
    user_id:{type:String}
})

module.exports = mongoose.model('reply',replySchema)