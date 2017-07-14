let mongoose = require('mongoose')

let Schema = mongoose.Schema

let userSchema = new Schema({
    user_name:{type:String},
    user_password:{type:String},
    user_email:{type:String,unique:true},
    user_active:{type:String},
    user_register_time:{type:String},
    user_last_login_time:{type:String},
    is_admin:{type:Boolean,default:false}
})
let koauser = mongoose.model('koauser',userSchema);


module.exports = {
    koauser
}