const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { isAdmin } = require('../middleware/isAdmin');

router.route('/').get(userController.home);
router.route('/register').post(userController.registerUser).get(userController.renderRegisterPage);
router.route('/login').post(userController.loginUser).get(userController.renderLoginPage);
router.route('/test').get(isAuthenticated,isAdmin);
router.route('/logout').get(userController.logout);
router.route('/searchBlogs').post(userController.searchBlogs);

//user apis
router.route('/users').get(userController.renderAllUsers);
router.route('/users/:id').get(userController.renderUser).put(userController.updateUser).delete(userController.deleteUser);


//post apis
module.exports = router;