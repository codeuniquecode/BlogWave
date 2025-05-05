const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        require:true,
        type:String
    },
    email:{
        require:true,
        unique:true,
        type:String
    },
    password:{
        require:false,
        sparse:true,
        type:String
    },
    role:{
        required:true,
        type:String,
        default:'user'
    },
    otp:{
        required:false,
        type:Number,
        default:null
    },
    otpGeneratedTime:{
        required:false,
        type:Number,
        default:null
    },
    isOauth:{
        required:false,
        type:Boolean,
        default:false
    }
});
const user = mongoose.model("User",UserSchema);
module.exports = user;
