// this is a middleware to see if the user is logged in or not as well as to show the username in navbar
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const user = require('../model/registerSchema');

exports.isLoggedIn = async (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        res.locals.currentUser = null;
        res.locals.userName = null;
        next();
        return;
    }
    else{
        const decryptedResult = await promisify(jwt.verify)(token, process.env.SECRETKEY);
        const validUser = await user.findOne({
            _id:decryptedResult.id
        });
        res.locals.currentUser = decryptedResult;
    
        res.locals.userName= validUser.name;
        // console.log(decryptedResult);
        // console.log(`------ ${decryptedResult.name}`);
        console.log(`the username is -  ${validUser.name}`);
        next();
    }
    }
   