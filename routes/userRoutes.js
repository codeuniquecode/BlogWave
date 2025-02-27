const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { isAuthenticated } = require('../middleware/isAuthenticated');


// router.get('/',userController.home);
// router.get('/register',userController.registerUser);
// router.get('/login')

router.route('/').get(userController.home);
router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);
// router.route('/test').get(isAuthenticated);
router.route('/logout').get(userController.logout);
module.exports = router;