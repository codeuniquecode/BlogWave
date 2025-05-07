const express = require('express');
const router = express.Router();
const userController = require('../controller/adminController');
const adminController = require('../controller/adminController');
router.route('/adminDashboard').get(adminController.renderDashboard);

module.exports = router;