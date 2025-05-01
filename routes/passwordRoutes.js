const express = require('express');
const router = express.Router();
const passwordController = require('../controller/passwordController');
const {isLoggedIn} = require('../middleware/isLoggedIn');
router.route('/changePassword').get(passwordController.renderChangePassword).post(isLoggedIn,passwordController.changePassword);
router.route('/forgotPassword').get(passwordController.renderForgetPassword).post(passwordController.handleForgetPassword);
router.route('/verifyOtp').post(passwordController.enterNewPassword).put(passwordController.updatePassword);
module.exports = router;