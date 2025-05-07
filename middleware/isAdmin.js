const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const user = require('../model/registerSchema');
const { decrypt } = require('dotenv');

exports.isAdmin = async (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        // res.status(404).json({ error: "Token not found" });
        res.render('login',{message:'Please Login First!!!'});
        return;
    }
    const decryptedResult = await promisify (jwt.verify)(token,process.env.SECRETKEY);
    const validUser = await user.findOne({
        _id:decryptedResult.id,
        role:'admin'
    });
    if(!validUser){
        return res.status(301).json({ error: "Unauthorized access" });
    }
    else{
        //  res.status(200).json({ error: decryptedResult });
        req.adminId = decryptedResult.id;
        // res.redirect('/adminDashboard');
        next();
    }
   

}