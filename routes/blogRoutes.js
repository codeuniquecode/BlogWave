const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const { isAuthenticated } = require('../middleware/isAuthenticated');


//blog apis
router.route('/blogs').get(blogController.renderAllBlogs).post(isAuthenticated,blogController.postBlog);
router.route('/blogs/:id').get(blogController.renderSingleBlog).delete(blogController.deleteBlog).put(blogController.updateBlog);



module.exports = router;