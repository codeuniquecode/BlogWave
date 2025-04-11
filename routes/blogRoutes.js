const express = require('express');
const router = express.Router();
const blogController = require('../controller/blogController');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const multer = require('../middleware/multerConfig').multer;
const storage = require('../middleware/multerConfig').storage;
const upload = multer({storage:storage});

//blog apis
router.route('/blogs').get(blogController.renderAllBlogs).post(isAuthenticated,upload.single('image'),blogController.postBlog);
router.route('/blogs/:id').get(blogController.renderSingleBlog).delete(blogController.deleteBlog).put(blogController.updateBlog);

router.route('/myBlogs').get(isAuthenticated,blogController.renderMyBlog);

router.route('/write').get(blogController.renderWriteBlog).post(isAuthenticated,upload.single('image'),blogController.postBlog);
router.route('/search').get(blogController.search);
module.exports = router;