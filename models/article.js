let mongoose = require('mongoose')

let Schema = mongoose.Schema

let articleSchema = new Schema({
    user_id:{type:String},
    tab:{type:String},
    reply_count:{type:Number,default:0},
    article_time:{type:String},
    article_modifine_time:{type:String},
    article_title:{type:String},
    article_content:{type:String},
    article_tags:{type:Array,default:[]},
    acticle_read_times:{type:Number,default:0},
    is_good:{type:Boolean,default:false},
    is_top:{type:Boolean,default:false},
})

module.exports = mongoose.model('article',articleSchema)