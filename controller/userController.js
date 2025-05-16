const user = require('../model/registerSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blog = require('../model/blogSchema');
const {isLoggedIn} = require('../middleware/isLoggedIn');
exports.home = async(req, res) => {
    try {
        const categoryCounts = await blog.aggregate([
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 }
            }
          }
        ]);
    
        // convert array to object for easy EJS access
        const counts = {};
        categoryCounts.forEach(cat => {
          counts[cat._id.toLowerCase()] = cat.count;
        });
    
        res.render('home', { counts }); // pass it to EJS
      } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
      }
}
exports.registerUser = async (req, res) => {
    // name,email,passowrd
   
    const { name, email, password } = req.body;
    const userExists = await user.findOne({
        email
    });
    if(userExists){
        // return res.status(404).json({message:"user with this email already exists"});
        req.flash('error','user with this email already exists');
        return res.render('register',{flashMessage:req.flash('error')});
        // return res.render('register',{req.flash('error')});
    }
    const hashedPassword = await bcrypt.hash(password, 1);
    
    const data = new user({
        name,
        password: hashedPassword,
        email
    });
    await data.save();
    if (data) {
        req.flash('success','user registered successfully');
        return res.render('login',{flashMessage:req.flash('success')});

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
            // console.log(validEmail);
            console.log(validEmail.role);
            if(validEmail.role==='admin'){
                return res.redirect('/adminDashboard');
            }
            res.redirect('/');
            // return res.status(201).json({message:"login success"});
        }else{
            req.flash('error','Invalid Password')
            return res.render('login',{flashMessage:req.flash('error')});
        }
    }
    else{
        req.flash('error','Invalid Email');
        return res.render('login',{flashMessage:req.flash('error')})
        return res.status(201).json({message:"invalid email"});
    }
}
exports.logout = (req, res) => {
    
    res.clearCookie('token');
    res.redirect('/');
//    return res.status(200).json({ message: "Logged out successfully." });
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

    res.render('showBlogs', { blogs: results , userId : req.userId});
};


exports.renderRegisterPage = (req,res)=>{
    res.render('register');
}
exports.renderLoginPage =  (req,res)=>{
    res.render('login');
}
exports.renderEditProfile = async(req,res)=>{
    const userData = await user.findOne({
        _id:req.userId
    });
    if(!userData){
        res.render('login',{message:"user not found! login first"});
        return;
    }
    
    res.render('editProfile',{userData});
}
exports.editProfile =async(req,res)=>{

try {
    // console.log(`${req.userId} and ${name}  and ${email}`);
    // return;
    const updateInfo = await user.findByIdAndUpdate(req.userId, { name: req.body.name, email: req.body.email });
    if(!updateInfo){
        return res.status(404).json({error:"error in updating data"});
    }
    
      // Create a new token with updated information
      const token = jwt.sign({
          _id: updateInfo.userId
      }, process.env.SECRETKEY, { expiresIn: '30d' });

      // Set the new token in the response cookies
      res.cookie('token', token, { httpOnly: true });

      // Respond to the client
    //   return res.redirect('/login');
    return res.render('login',{message:"Profile Updated Successfully ! Pleasre re-login"})

} catch (error) {
    console.log(error);
}
    
}
exports.renderChatPage = (req,res)=>{
    res.render('chat')
}

