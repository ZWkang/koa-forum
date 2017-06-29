let mongoose = require('mongoose')

let Schema = mongoose.Schema

let collectionSchema = new Schema({
    user_id:{type:String},
    article_id:{type:String},
    collect_time:{type:String}
})

module.exports = mongoose.model('collection',collectionSchema)