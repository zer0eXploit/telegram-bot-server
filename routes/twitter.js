const express = require('express');
const router = express.Router();

// Controllers
const {
  twitterLogin,
  twitterCallback,
  tweetForYou,
} = require('../controllers/twitter');

router.route('/login/:username').get(twitterLogin);

router.route('/callback').get(twitterCallback);

router.route('/tweet-for/:username').post(tweetForYou);

module.exports = router;
