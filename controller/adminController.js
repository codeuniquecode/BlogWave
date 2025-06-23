const blog = require("../model/blogSchema");
const user = require("../model/registerSchema");

exports.renderDashboard = async(req,res)=>{
    const totalUsers = await user.find();
   const totalBlogs = await blog.find();
const totalBlogsByCategory = await blog.aggregate([
    {
        $group: {
            _id: "$category", // Group by category field
            totalCount: { $sum: 1 } // Count occurrences
        }
    }
]);
   const users = totalUsers.length;
   const blogs = totalBlogs.length;
    res.render('adminDashboard',{users, blogs,categoryStats:totalBlogsByCategory});
}
exports.renderUsers = async (req,res)=>{
    const userData = await user.find();
    res.render('users',{userData});
}
exports.deleteUser = async(req,res)=>{
    try {
    const validUser = await user.findByIdAndDelete(req.params.id);
    if(!validUser){
        req.flash('error','user doesnot exists');
        return res.render('users',{flashMessage:req.flash('error')});
    }
        const userData = await user.find();
    req.flash('success','user deleted');
    return res.render('users',{flashMessage:req.flash('success'),userData});
    } catch (error) {
        console.log('error in deleting user');
    }
}
exports.renderUserData = async(req,res)=>{
    const id = req.params.id;
    const userData = await user.findOne({_id:id});
    if(!userData){
        req.flash('error','user doesnt exists');
    }
    res.render('adminEditUser',{userData});
}
exports.editUserData = async(req,res)=>{
        const id = req.params.id;
        const {name} = req.body;
    const success = await user.findByIdAndUpdate({_id:id},{name});
    if(!success){
        req.flash('error','user doesnot exists');
    }
    req.flash('success','user data updated');
     const userData = await user.find();
    return res.render('users',{flashMessage:req.flash('success'),userData});
}
exports.renderAllBlogs = async(req,res)=>{
    const blogs = await blog.find();
    return res.render('adminEditBlog',{blogs})
}
exports.approveBlog = async(req,res)=>{
    const id = req.params.id;
    if(!id){
        return res.status(404).json({message:"Blog not found"});
    }
    try {
        const approveBlog = await blog.findByIdAndUpdate(req.params.id,{
            isApproved:'approved'
        });
        if(!approveBlog){
            return res.status(404).json({message:"error in approving blog"});
        }
        return res.status(200).json({message:"blog approved"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"internal server error"});
    }
}
exports.rejectBlog = async(req,res)=>{
 const id = req.params.id;
    if(!id){
        return res.status(404).json({message:"Blog not found"});
    }
    try {
        const rejectBlog = await blog.findByIdAndUpdate(req.params.id,{
            isApproved:'rejected'
        });
        if(!rejectBlog){
            return res.status(404).json({message:"error in rejecting blog"});
        }
        return res.status(200).json({message:"blog rejected"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"internal server error"});
    }
}