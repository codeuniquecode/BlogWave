const mongoose = require('mongoose');

mongoose.connect(process.env.mongodbURI).then(()=>{
    console.log("database connected");
}).catch((e)=>{
    console.log('Error in connecting database'+e);
    
});
