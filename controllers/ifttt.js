const Twitter = require('../helper/twitter-api');
const fetch = require('node-fetch');

const sendNotification = require('../helper/send-notification');

// @desc    Handle webhook call from IFTTT, calls the twitter API to tweet.
// @desc    IFTTT calls whenever the twitter user being watched tweets.
// @route   POST /ifttt/user-tweeted
// @access  Public
exports.specificUserTweeted = async (req, res) => {
  const key = req.query.accessKey;

  if (key !== process.env.SERVER_ACCESS_KEY) {
    return res.status(403).json({
      error: true,
      message: 'Access key is required!',
    });
  }

  const text = req.body.split(' @splitter ')[0];
  // username and link at indices 1 and 2 respectively

  try {
    const parameters = { status: text, trim_user: true };

    const tweet = await Twitter.tweets.statusesUpdate(parameters);

    return res.status(200).json({
      success: true,
      tweet: tweet,
    });
  } catch (e) {
    let message = e.message;
    const notiTitle = 'Error tweeting';
    const priority = 1;

    if (e.statusCode) {
      message = e.data.errors[0].message;
    }

    await sendNotification(notiTitle, message, priority);

    console.log(e);

    return res.status(500).json({
      error: true,
      message: message,
    });
  }
};

// @desc    Handle webhook call from IFTTT, then calls IFTTT back to tweet.
// @desc    IFTTT calls whenever the twitter user being watched tweets.
// @route   POST /ifttt/hmnoo/user-tweeted
// @access  Public
exports.handleIFTTTCallFromPerson = async (req, res) => {
  const text = req.body.split(' @splitter ')[0];
  // username and link at indices 1 and 2 respectively

  try {
    const IFTTT_URI = process.env.IFTTT_TRIGGER_EVENT_URI_HMNOO;
    fetch(IFTTT_URI, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        value1: text,
      }),
    });

    return res.status(200).json({
      success: true,
    });
  } catch (e) {
    const message = 'Error calling IFTTT wehbook.';
    const notiTitle = 'Error calling IFTTT from H';
    const priority = 1;

    await sendNotification(notiTitle, message, priority);

    console.log(e);

    return res.status(500).json({
      error: true,
    });
  }
};
