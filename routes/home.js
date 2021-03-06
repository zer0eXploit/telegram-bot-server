// Core Modules
const express = require('express');
const router = express.Router();

// Controllers
const { homeController } = require('../controllers/home');

router.route('/').get(homeController);

module.exports = router;
