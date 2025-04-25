const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const multer = require('../middleware/multerConfig').multer;
const storage = require('../middleware/multerConfig').storage;
const upload = multer({storage:storage});

//blog apis
router.route('/blogs').get(isLoggedIn,blogController.renderAllBlogs).post(isAuthenticated,upload.single('image'),blogController.postBlog);
router.route('/blogs/:id').get(isLoggedIn,blogController.renderSingleBlog).delete(isAuthenticated,blogController.deleteBlog);
router.route('/editBlog/:id').get(isLoggedIn,blogController.editBlog).put(isAuthenticated,upload.single('image'),blogController.updateBlog)
router.route('/myBlogs').get(isAuthenticated,isLoggedIn,blogController.renderMyBlog);
router.route('/blogs/category/:category').get(isLoggedIn,blogController.getBlogsByCategory);
router.route('/write').get(blogController.renderWriteBlog).post(isAuthenticated,upload.single('image'),blogController.postBlog);
router.route('/search').get(blogController.search);
module.exports = router;