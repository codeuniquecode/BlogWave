const express = require('express');
const router = express.Router();
// const userController = require('../controller/adminController');
const adminController = require('../controller/adminController');
const blogController = require('../controller/blogController');
const { isAdmin } = require('../middleware/isAdmin');
router.route('/adminDashboard').get(isAdmin,adminController.renderDashboard);
router.route('/manageUser').get(adminController.renderUsers);
router.route('/manageUser/:id').delete(adminController.deleteUser);
router.route('/editUser/:id').get(adminController.renderUserData).patch(adminController.editUserData);
router.route('/approve/:id').patch(adminController.approveBlog);
router.route('/reject/:id').patch(adminController.rejectBlog);
router.route('/seeBlogs').get(adminController.renderBlogs);
router.route('/viewBlog/:id').get(blogController.renderSingleBlog);
// for blogs
router.route('/manageBlog').get(adminController.renderAllBlogs);
module.exports = router;