const mongoose = require('mongoose');
const moment = require('moment');
const user = require('./registerSchema');
const date = new Date(Date.now());
const blogSchema = mongoose.Schema({
    // title,description,author,image,date
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User' 
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type: String,
        required: true,
        enum: ["Food", "Technology", "Cars", "Lifestyle", "Books", "Stocks"]
    },
    date:{
        type:String,
        default:moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }
});


//model
const blog = mongoose.model("Blog",blogSchema);
module.exports = blog;