const user = require('../model/registerSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blog = require('../model/blogSchema');
exports.home = (req, res) => {
    res.render('home');
    // return res.status(200).json({ message: "home page here" });
}
exports.registerUser = async (req, res) => {
    // name,email,passowrd
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 1);

    const data = new user({
        name,
        password: hashedPassword,
        email
    });
    await data.save();
    if (data) {
        return res.status(201).json({ message: "user registered successfully.", data });
    }
    else {
        return res.status(404).json({ message: "error in registering user." });
    }

}
exports.loginUser = async (req, res) => {
    const {email,password} = req.body;
    const validEmail = await user.findOne({
        email
    });
    if(validEmail){
        const validPassword = await bcrypt.compare(password, validEmail.password);
        if(validPassword){
            const token = jwt.sign({id:validEmail._id},process.env.SECRETKEY,{
                expiresIn:'1d'
            });
            res.cookie("token", token,{
                maxAge:24*60*60*1000
            });
            return res.status(201).json({message:"login success"});
        }else{
            return res.status(404).json({ message:"invalid password" });
        }
    }
    else{
        return res.status(201).json({message:"invalid email"});
    }
}
exports.logout = (req, res) => {
    res.clearCookie('token');
   return res.status(200).json({ message: "Logged out successfully." });
};
exports.renderAllUsers = async (req,res)=>{
    try{
    const userData = await user.find();
    return res.status(200).json({userData});
    }
    catch(error){
        console.log(error);
        return res.status(404).json({error:"error in fetching user data"});
    }

}
exports.renderUser = async(req,res)=>{
    try{
        const userData = await user.findById(req.params.id);
        if(!userData){
            return res.status(404).json({message:"user not found"});
        }
        return res.status(200).json({userData});
    }
    catch(error){
        console.log(error);
        return res.status(404).json({error:"error in rendering user data"});
    }
}
exports.updateUser = async(req,res)=>{
    try{
        const userData = await user.findByIdAndUpdate(req.params.id, req.body);
        if(!userData){
            return res.status(404).json({message:"user not found"});
        }
        return res.status(200).json({message:"user updated successfully",userData});
    }
    catch(error){
        console.log(error);
    
        return res.status(404).json({error:"error in updating user data"});
        
    }
}
exports.deleteUser = async(req,res)=>{
    try{
        const userData = await user.findByIdAndDelete(req.params.id);
        if(!userData){
            return res.status(404).json({message:"user not found"});
        }
        return res.status(200).json({message:"user data deleting successfully."});
    }
    catch(error){
        console.log(error);
        
        return res.status(404).json({error:"error in deleting user data"});
    }
}
exports.search =async(req,res)=>{
    const searchKeyword = req.query.search;
    if(!searchKeyword){
        return res.status(404).json({error:"no search keyword"});
    }
    const results = await blog.find({
        title: { $regex: searchKeyword, $options: "i" } // Case-insensitive search
    });
    if(results.length ===0){
        return res.status(404).json({error:"Try using some different keywords."});
    }
    return res.status(200).json({results});
}

exports.renderRegisterPage = (req,res)=>{
    res.render('register');
}