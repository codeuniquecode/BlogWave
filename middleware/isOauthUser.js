const user = require("../model/registerSchema");
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
exports.isOauthUser = async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        // res.status(404).json({ error: "Token not found" });
        res.render('login',{message:'Please Login First!!!'});
        return;
    }
    else{
        decryptedResult = await promisify(jwt.verify)(token, process.env.SECRETKEY);
        const oauthUser = await user.findOne({_id:decryptedResult.id});
        if(oauthUser.isOauth===false){
            next();
        }
        else{
            return res.status(403).json({message:"Password change is not applicable for Google login users !!!"});
        }
    }
}