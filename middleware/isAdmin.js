const user = require("../model/registerSchema");

exports.isAdmin = async (req,res,next)=>{
    const id = req.user;
    const validAdmin = await user.findById(id);
    console.log(id);
   console.log(validAdmin.role);
    if(!validAdmin || validAdmin.role !== 'admin'){
        res.status(401).json({message:"unauthorized access"});
    }
    else{
    res.status(200).json({message:"valid admin"});
    next();
    }
}