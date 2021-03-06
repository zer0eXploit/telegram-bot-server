const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const twitterAPIClient = require("twitter-api-client");

const userExists = require("../helper/air-table");
const sendNotification = require("../helper/send-notification");

// @desc    Handles Login via Twitter
// @route   GET /twitter/login/:username
// @access  Private
exports.twitterLogin = async (req, res, next) => {
  try {
    const records = await userExists(req.params.username);

    if (!!!records.length) {
      return res.status(401).json({
        error: true,
        message: "You are not an authorized user.",
      });
    }

    // Authenticate with passport and send the access token via notification
    passport.use(
      new TwitterStrategy(
        {
          consumerKey: records[0].get("consumer_key"),
          consumerSecret: records[0].get("consumer_secret"),
          callbackURL: process.env.TWITTER_CALLBACK_URL,
        },
        async function (token, tokenSecret, profile, done) {
          const notiTitle = `${profile.username}'s Twitter Credentials`;
          const message = `Token - ${token} \nSecret - ${tokenSecret}`;
          const notiInfo = {
            value1: notiTitle,
            value2: message,
            value3: "",
          };
          await sendNotification(notiInfo);
          done(null, {});
        },
      ),
    );

    return passport.authenticate("twitter")(req, res, next);
  } catch (e) {
    try {
      const notiInfo = {
        value1: "Twitter Login Error",
        value2: "An error occurred while logging in via Twitter.",
        value3: e.message,
      };
      await sendNotification(notiInfo);
    } catch (e) {
      console.log(e);
    }

    return res.status(500).json({
      error: true,
      message: "Something went wrong on our server.",
    });
  }
};

// @desc    Handles callback from twitter
// @route   GET /twitter/callback
// @access  Public
exports.twitterCallback = (req, res, next) => {
  return passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: "/failed",
    session: false,
  })(req, res, next);
};

// @desc    Tweet on behalf of user
// @route   POST /twitter/tweet-for/:username
// @access  Private
exports.tweetForYou = async (req, res) => {
  const records = await userExists(req.params.username);

  if (!!!records.length) {
    return res.status(401).json({
      error: true,
      message: "You are not an authorized user.",
    });
  }

  try {
    const [accessToken, accessTokenSecret, text] =
      req.body.split(" @splitter ");

    if (!accessToken || !accessTokenSecret || !text)
      return res.status(400).end();

    const Twitter = new twitterAPIClient.TwitterClient({
      apiKey: records[0].get("consumer_key"),
      apiSecret: records[0].get("consumer_secret"),
      accessToken: accessToken,
      accessTokenSecret: accessTokenSecret,
    });

    const parameters = { status: text, trim_user: true };

    const tweet = await Twitter.tweets.statusesUpdate(parameters);

    res.status(200).json({
      success: true,
      message: tweet,
    });
  } catch (e) {
    let errMessage = e.message;
    let notiData = {
      value1: "Auto Tweeting Error",
      value2: e.message,
    };

    try {
      if (e.statusCode) {
        const errorData = JSON.parse(e.data);
        const { code, message } = errorData.errors[0];
        errMessage = message;

        notiData = {
          value1: "Auto Tweeting Error",
          value2: `Error code - ${code}`,
          value3: message,
        };
      } else {
        // Log error only if it is not from twitter
        // because twitter errors always contain statusCode
        console.log(e);
      }

      await sendNotification(notiData);
    } catch (e) {
      console.log(e);
    }

    return res.status(500).json({
      error: true,
      message: errMessage,
    });
  }
};
