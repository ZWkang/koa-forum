let mongoose = require('mongoose')

let Schema = mongoose.Schema

let starSchema = new Schema({
    user_id:{type:String},
    reply_id:{type:String},
    star_time:{type:String}
})

module.exports = mongoose.model('star',starSchema)