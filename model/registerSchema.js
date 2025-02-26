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
    }
});
const user = mongoose.model("User",UserSchema);
module.exports = user;
