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


// for blogs
router.route('/manageBlog').get(adminController.renderAllBlogs);
module.exports = router;