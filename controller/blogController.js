const blog = require("../model/blogSchema");
const user = require("../model/registerSchema");
const fs = require('fs');
exports.renderAllBlogs = async(req,res)=>{
    // const blogs = await blog.find();
    const blogs = await blog.find().populate('author', 'name');
    if(blogs){
        res.render('showBlogs',{blogs});

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
    return res.status(200).json({message:"blog found.",blogData});
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
        res.render('showBlogs',{blogs:blogData});
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
exports.updateBlog = async (req,res)=>{
    try {
        const blogData = await blog.findByIdAndUpdate(req.params.id,req.body);
        if(!blogData){
            return res.status(404).json({message:"blog not found"});
        }
        return res.status(201).json({message:"blog updated successfylly",blogData});

    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: "error in updating blog." });
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
    res.render('showBlogs',{blogs:results})
}
