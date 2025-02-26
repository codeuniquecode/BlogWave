const user = require('../model/registerSchema');
const bcrypt = require('bcrypt');
exports.home = (req,res)=>{
    res.render('home');
    return res.status(200).json({message: "home page here" });
}
exports.registerUser = async (req,res)=>{
    // name,email,passowrd
const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,1);


    const data = new user({
        name,
        password:hashedPassword,
        email
    });
    await data.save();
    if(data){

    
    return res.status(201).json({message:"user registered successfully.",data }); 
    }
    else{
        return res.status(404).json({message:"error in registering user."});
    }
    
}
exports.loginUser = async (req,res)=>{

}