const mongoose = require('mongoose');
const moment = require('moment');

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
        type:String,
        // required:true
    },
    image:{
        type:String,
        // required:true,
        default:null
    },
    date:{
        type:String,
        default:moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }
});


//model
const blog = mongoose.model("Blog",blogSchema);
module.exports = blog;