const user = require('../model/registerSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blog = require('../model/blogSchema');
exports.home = (req, res) => {
    res.render('home');
    return res.status(200).json({ message: "home page here" });
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
exports.renderAllBlogs = async(req,res)=>{
    const blogs = await blog.find();
    if(blogs){
        return res.status(200).json({ blogs });
    }
    else{
        
    return res.status(404).json({ error: "Blogs not found" });
    }
}
exports.postBlog = async(req,res)=>{
    // return res.status(404).json({ error: req.user });
    const validAuthor = await user.findOne({
        _id:req.user
    });
    if(!validAuthor){
        return res.status(404).json({ error: "Invalid Author" });
    }
    // return res.status(404).json({ error: {validAuthor} });
    const {title,description,image} = req.body;
    const newBlog = new blog({
        title,
        description,
        author:validAuthor.name,
        image
    });
    await newBlog.save();
    if(newBlog){
        return res.status(201).json({ message:"Blog posted successfully."});
    }
    else{
        return res.status(404).json({ error: "Error in posting blogs." });
    }

}
exports.renderSingleBlog = async(req,res)=>{
   try {
    const blogData = await blog.findById(req.params.id);
    return res.status(200).json({message:"blog found.",blogData});
   } catch (error) {
    return res.status(404).json({message:"error in finding blog-invalid id", error})
   }
}
exports.deleteBlog = async(req,res)=>{
    try {
        const blogData = await blog.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"blog deleted successfully.",blogData});
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "error in deleting blog" });
    }
}
exports.updateBlog = async (req,res)=>{
    try {
        const blogData = await blog.findByIdAndUpdate(req.params.id,req.body);
        return res.status(201).json({message:"blog updated successfylly",blogData});

    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "error in updating blog." });
    }
}
// GET /users/:id → Get user profile
// PUT /users/:id → Update user profile
// DELETE /users/:id → Delete user account (optional)

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
        return res.status(200).json({message:"user updated successfully",userData});
    }
    catch(error){
        console.log(error);
    
        return res.status(404).json({error:"error in updating user data"});
        
    }
}
exports.deleteUser = async(req,res)=>{
    try{
        await user.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"user data deleting successfully."});
    }
    catch(error){
        console.log(error);
        
        return res.status(404).json({error:"error in deleting user data"});
    }
}