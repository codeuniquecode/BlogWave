const user = require("../model/registerSchema");
const bcrypt = require('bcrypt');
exports.renderChangePassword = (req,res)=>{
    res.render('changePassword');
}
exports.changePassword = async (req,res)=>{
    const {old_password, new_password} = req.body;
    // console.log(req.userId);
    const validUser = await user.find({
        _id:req.userId
    });
    if(!validUser){
        return res.status(404).json({error:"user doesnot exists"});
    }
    const validPassword =await bcrypt.compare(old_password,validUser[0].password);
    if(!validPassword){
        return res.status(404).json({error:"Old password is not correct"});
    }
    const newPassword = await bcrypt.hash(new_password,1);
    const updatePassword = await user.findByIdAndUpdate(req.userId,{
        password:newPassword
    });
    if(!updatePassword){
        return res.status(404).json({error:"error in updating password"});
    }
    res.clearCookie('token');
    return res.render('login',{message:"Password changed successfully. Please re-login !!!"});
}
