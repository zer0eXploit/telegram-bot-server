// Core Modules
const express = require('express');
const router = express.Router();

// Controllers
const {
  specificUserTweeted,
  handleIFTTTCallFromPerson,
} = require('../controllers/ifttt');

router.route('/user-tweeted').post(specificUserTweeted);
router.route('/hmnoo/user-tweeted').post(handleIFTTTCallFromPerson);

module.exports = router;
