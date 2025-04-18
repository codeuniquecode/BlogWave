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
    const userExists = await user.findOne({
        email
    });
    if(userExists){
        return res.status(404).json({message:"user with this email already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 1);
    
    const data = new user({
        name,
        password: hashedPassword,
        email
    });
    await data.save();
    if (data) {
        res.redirect('/login');
        // return res.status(201).json({ message: "user registered successfully.", data });
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
            // console.log('login success');
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
exports.searchBlogs = async (req, res) => {
    const { keyword } = req.body;

    if (!keyword) {
        return res.status(404).json({ error: "No search keyword provided." });
    }
    let results = await blog.find({
        title: { $regex: keyword, $options: "i" } // Case-insensitive search
    });

    if (results.length === 0) {
        results = await blog.find({
            category: { $regex: keyword, $options: "i" }
        });

        if (results.length === 0) {
            return res.status(404).json({ error: "No blogs found for the given keyword/category." });
        }
    }

    res.render('showBlogs', { blogs: results });
};


exports.renderRegisterPage = (req,res)=>{
    res.render('register');
}
exports.renderLoginPage = (req,res)=>{
    res.render('login');
}

