const path = require("path");
const blog = require("../model/blogSchema");
const user = require("../model/registerSchema");
const fs = require('fs');
exports.renderAllBlogs = async(req,res)=>{
    // const blogs = await blog.find();
    const blogs = await blog.find().populate('author', 'name');
    if(blogs){
        res.render('showBlogs',{blogs,userId:req.userId});

        // return res.status(200).json({ blogs });
    }
    else{
        
    return res.status(404).json({ error: "Blogs not found" });
    }
}
exports.renderWriteBlog =(req,res)=>{
    res.render('writeBlog');
}
exports.postBlog = async(req,res)=>{
    // return res.status(404).json({ error: req.user });
    console.log(req.user);
    const validAuthor = await user.findOne({
        _id:req.user
    });
    if(!validAuthor){
        return res.status(404).json({ error: "Invalid Author" });
    }
    // return res.status(404).json({ error: {validAuthor} });
    const {title,description,category} = req.body;
    // console.log(req.body);
    // console.log('-----------');
    // console.log(req.file);
    // return;
    const newBlog = new blog({
        title,
        description,
        image:req.file.filename,
        category,
        author:req.user
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
    if(!blogData){
        return res.status(404).json({message:"blog not found"});
    }
    // return res.status(200).json({message:"blog found.",blogs:blogData});
    res.render('singleBlog.ejs',{blog:blogData});
   } catch (error) {
    return res.status(404).json({message:"error in finding blog-invalid id", error})
   }
}
exports.renderMyBlog = async(req,res)=>{
    try{
        const blogData =  await blog.find({ author: req.user }).populate("author");
        if(!blogData){
            return res.status(404).json({message:"blog not found"});
        }
        // return res.status(200).json({blogData});
        
        res.render('showBlogs',{blogs:blogData, userId: req.userId});
        return;

    }
    catch(error){
        console.log(error);
        return res.status(404).json({message:"error in rendering your blog"});
    }
}
exports.deleteBlog = async(req,res)=>{
    try {
        const blogData = await blog.findByIdAndDelete(req.params.id);
        if(!blogData){
            return res.status(404).json({message:"blog not found"});
        }
        const oldImage = blogData.image;
        fs.unlink('storage/'+oldImage,(e)=>{
            if(e){
                console.log('error in deleting old image',e);
                
            }
            else{
                console.log('blog deleted with old image');
                
            }
        })
        return res.status(200).json({message:"blog deleted successfully.",blogData});
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "error in deleting blog" });
    }
}
exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const existingBlog = await blog.findById(blogId);

        if (!existingBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Prepare updated fields
        const updateData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
        };

        // Handle image update and delete old one
        if (req.file) {
            const oldImagePath = path.join(__dirname, "../public/uploads", existingBlog.image);
            
            // Delete old image if it exists
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            updateData.image = req.file.filename; // store new image filename
        }

        const updatedBlog = await blog.findByIdAndUpdate(blogId, updateData, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({ message: "Blog updated successfully", updatedBlog });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error in updating blog." });
    }
};
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
    res.render('showBlogs',{blogs:results})
}
exports.editBlog = async (req,res)=>{
   
    const validBlog = await blog.find({_id:req.params.id});
   
    if(!validBlog){
        return res.status(404).json({error:"No blogs found"});
    }
    
    const blogData = validBlog[0];
    res.render('editBlog',{blogData});
}
exports.getBlogsByCategory = async (req, res) => {
    const category = req.params.category;
    try {
      const blogs = await blog.find({ category }).populate('author', 'name');
      res.render('showBlogs', { blogs,userId: req.userId });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };