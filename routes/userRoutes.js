const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { isAdmin } = require('../middleware/isAdmin');
const {isLoggedIn} = require('../middleware/isLoggedIn');

router.route('/').get(isLoggedIn,userController.home);
router.route('/register').post(userController.registerUser).get(userController.renderRegisterPage);
router.route('/login').post(userController.loginUser).get(userController.renderLoginPage);
router.route('/test').get(isAuthenticated,isAdmin);
router.route('/logout').get(userController.logout);
router.route('/searchBlogs').post(userController.searchBlogs);

//admin---user apis
router.route('/users').get(userController.renderAllUsers);
router.route('/users/:id').get(userController.renderUser).put(userController.updateUser).delete(userController.deleteUser);


// user apis
router.route('/editProfile').get(isLoggedIn,userController.renderEditProfile).post(isLoggedIn,userController.editProfile);
router.route('/changePassword').get(userController.renderChangePassword).post(isLoggedIn,userController.changePassword);
//post apis
module.exports = router;