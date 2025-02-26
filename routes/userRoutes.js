const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


// router.get('/',userController.home);
// router.get('/register',userController.registerUser);
// router.get('/login')

router.route('/').get(userController.home);
router.route('/register').post(userController.registerUser);
module.exports = router;