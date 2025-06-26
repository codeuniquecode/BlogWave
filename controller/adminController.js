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
        const updatedBlog = await blog.findByIdAndUpdate(id, {
            isApproved: 'approved'
        });

        if (!updatedBlog) {
            req.flash('error', 'Error in approving blog');
        } else {
            req.flash('success', 'Blog Approved');
        }

         res.redirect(req.get('Referer')); // go back to the previous page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to approve blog');
         res.redirect(req.get('Referer'));
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
        if (!rejectBlog) {
            req.flash('error', 'Error in rejecting blog');
        } else {
            req.flash('success', 'Blog Rejected');
        }
         res.redirect(req.get('Referer'));
    } catch (error) {
         console.error(error);
        req.flash('error', 'Failed to approve blog');
         res.redirect(req.get('Referer'));
    }
}
exports.renderBlogs = async(req,res)=>{
    const successMessages = req.flash('success');
        const errorMessages = req.flash('error');
const blogs = await blog.find({
  isApproved: { $ne: 'approved' }
}).populate('author', 'name');

    //  const blogs = await blog.find().populate('author', 'name');
    if(blogs){
        
       return res.render('reviewBlogs',{blogs,flashMessage: successMessages.length > 0 ? successMessages[0] : (errorMessages.length > 0 ? errorMessages[0] : null)});

        // return res.status(200).json({ blogs });
    }
    else{
    return res.status(404).json({ error: "Blogs not found" });
    }
}