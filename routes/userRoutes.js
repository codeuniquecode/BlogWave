const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { isAuthenticated } = require('../middleware/isAuthenticated');

router.route('/').get(userController.home);
router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);
router.route('/test').get(isAuthenticated);
router.route('/logout').get(userController.logout);

//blog apis
router.route('/blogs').get(userController.renderAllBlogs).post(isAuthenticated,userController.postBlog);
router.route('/blogs/:id').get(userController.renderSingleBlog).delete(userController.deleteBlog).put(userController.updateBlog);


//user apis
router.route('/users').get(userController.renderAllUsers);
router.route('/users/:id').get(userController.renderUser).put(userController.updateUser).delete(userController.deleteUser);
module.exports = router;