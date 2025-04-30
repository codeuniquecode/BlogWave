const express = require('express');
const router = express.Router();
const passwordController = require('../controller/passwordController');
const {isLoggedIn} = require('../middleware/isLoggedIn');
router.route('/changePassword').get(passwordController.renderChangePassword).post(isLoggedIn,passwordController.changePassword);


module.exports = router;