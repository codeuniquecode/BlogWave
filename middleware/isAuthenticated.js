const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const user = require('../model/registerSchema');
const { decrypt } = require('dotenv');

exports.isAuthenticated = async (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(404).json({ error: "Token not found" });
    }
    const decryptedResult = await promisify (jwt.verify)(token,process.env.SECRETKEY);
    const validUser = await user.findOne({
        _id:decryptedResult.id
    });
    if(!validUser){
        return res.status(404).json({ error: "User not found" });

    }
    else{
        //  res.status(200).json({ error: decryptedResult });
        req.user = decryptedResult.id;
        next();
    }
   

}