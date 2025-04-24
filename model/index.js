const mongoose = require('mongoose');
const { envConfig } = require('../config/envConfig');

mongoose.connect(envConfig.url).then(()=>{
    console.log("database connected");
}).catch((e)=>{
    console.log('Error in connecting database'+e);
    
});
