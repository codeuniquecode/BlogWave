const blog = require('../model/blogSchema');

const mongoose = require('mongoose');

async function recommendBlogs(blogId) {
const blogObjectId = new mongoose.Types.ObjectId(blogId);
    // Find the blog by ID to get its category
    const blogData = await blog.findOne({ _id: blogId });

    if (!blogData || !blogData.category) {
        console.log('No blog found with this ID');
        return [];
    }

    console.log('Matching category:', blogData.category);
    // const relatedBlogs = await blog.find({
    //     _id: { $ne: blogId }, // Exclude the current blog
    //     category: blogData.category // Match category
    // }).limit(3);
    const relatedBlogs = await blog.aggregate([
        {
            $match: {
                _id: { $ne: blogObjectId }, 
                category: blogData.category 
            }
        },
        {
            $sample: { size: 3 } 
        }
    ]);

    return relatedBlogs;
}



module.exports = recommendBlogs;