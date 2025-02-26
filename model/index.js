const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/BlogWave').then(()=>{
    console.log("database connected");
}).catch((e)=>{
    console.log('Error in connecting database'+e);
    
});
