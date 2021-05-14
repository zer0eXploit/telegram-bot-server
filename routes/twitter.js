const express = require('express');
const router = express.Router();

// Controllers
const { twitterLogin, twitterCallback } = require('../controllers/twitter');

router.route('/login/:username').get(twitterLogin);

router.route('/callback').get(twitterCallback());

module.exports = router;
