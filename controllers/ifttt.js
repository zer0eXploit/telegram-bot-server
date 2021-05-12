const Twitter = require('../helper/twitter-api');

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
    const notiTitle = 'Tweeted on twitter';
    const notiMessage = 'A new tweet was successfully tweeted.';
    const priority = 1;
    const linkText = 'Click to view the tweet.';

    const tweet = await Twitter.tweets.statusesUpdate(parameters);

    const linkUrl = `https://twitter.com/yw_pann/status/${tweet.id_str}`;

    const pushoverRes = await sendNotification(
      notiTitle,
      notiMessage,
      priority,
      linkUrl,
      linkText,
    );

    if (!pushoverRes.ok)
      throw new Error(`Pushover server error. Status ${pushoverRes.status}`);

    return res.status(200).json({
      success: true,
      tweet: tweet,
    });
  } catch (e) {
    const notiTitle = 'Error tweeting';
    const message = e.message;
    const priority = 1;

    await sendNotification(notiTitle, message, priority);

    console.log(e);

    return res.status(500).json({
      error: true,
      message: message,
    });
  }
};
