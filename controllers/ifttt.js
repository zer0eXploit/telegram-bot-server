const Twitter = require('../helper/twitter-api');
const fetch = require('node-fetch');

// @desc    Handle webhook call from IFTTT, calls the twitter API to tweet.
// @desc    IFTTT calls whenever the twitter user being watched tweets.
// @route   POST /ifttt/user-tweeted
// @access  Public
exports.specificUserTweeted = async (req, res) => {
  const text = req.body.split(' @splitter ')[0];
  // username and link at indices 1 and 2 respectively

  try {
    const parameters = {
      status: text,
      trim_user: true,
    };

    const tweet = await Twitter.tweets.statusesUpdate(parameters);

    return res.status(200).json({
      success: true,
      tweet: tweet,
    });
  } catch (e) {
    return res.status(500).json({
      error: true,
      message: e.message,
    });
  }
};
