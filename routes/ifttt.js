// Core Modules
const express = require('express');
const router = express.Router();

// Controllers
const { specificUserTweeted } = require('../controllers/ifttt');

router.route('/user-tweeted').post(specificUserTweeted);

module.exports = router;
