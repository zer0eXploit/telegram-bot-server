const Twitter = require("../helper/twitter-api");

const sendNotification = require("../helper/send-notification");

// @desc    Handle webhook call from IFTTT, calls the twitter API to tweet.
// @desc    IFTTT calls whenever the twitter user being watched tweets.
// @route   POST /ifttt/user-tweeted
// @access  Private
// @auth    Custom access key
exports.specificUserTweeted = async (req, res) => {
  const key = req.query.accessKey;

  if (key !== process.env.SERVER_ACCESS_KEY) {
    return res.status(403).json({
      error: true,
      message: "Access key is required!",
    });
  }

  try {
    const text = req.body.split(" @splitter ")[0];
    // username and link at indices 1 and 2 respectively

    const parameters = { status: text, trim_user: true };

    const tweet = await Twitter.tweets.statusesUpdate(parameters);

    return res.status(200).json({
      success: true,
      tweet: tweet,
    });
  } catch (e) {
    let message = e.message;
    let notiData = {
      value1: e.message,
    };

    try {
      if (e.statusCode) {
        const errorData = JSON.parse(e.data);

        message = errorData.errors[0].message;
        notiData = {
          value1: e.statusCode,
          value2: errorData.errors[0].code,
          value3: errorData.errors[0].message,
        };
      }

      await sendNotification(notiData);
    } catch (e) {
      console.log(e);
    }

    console.log(e);

    return res.status(500).json({
      error: true,
      message: message,
    });
  }
};
