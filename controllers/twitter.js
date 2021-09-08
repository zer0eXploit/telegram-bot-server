const passport = require("passport");
const Airtable = require("airtable");
const TwitterStrategy = require("passport-twitter").Strategy;
const twitterAPIClient = require("twitter-api-client");

const sendNotification = require("../helper/send-notification");

// @desc    Handles Login via Twitter
// @route   GET /twitter/login/:username
// @access  Private
exports.twitterLogin = async (req, res) => {
  try {
    const apiKey = process.env.AIR_TABLE_API_KEY;
    const filterByFormula = `{username} = '${req.params.username}'`;
    const base = new Airtable({ apiKey }).base("appRCF5ZGpwgJVzd6");

    const records = await base("AllowedUsers")
      .select({ filterByFormula })
      .firstPage();

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

    return passport.authenticate("twitter")(req, res);
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
exports.twitterCallback = (req, res) => {
  return passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: "/failed",
    session: false,
  })(req, res);
};

// @desc    Tweet on behalf of user
// @route   POST /twitter/tweet-for/:username
// @access  Private
exports.tweetForYou = async (req, res) => {
  if (!credentials[req.params.username])
    return res.status(404).json({
      success: false,
      error: "User not found.",
    });

  try {
    const [accessToken, accessTokenSecret, text] =
      req.body.split(" @splitter ");

    if (!accessToken || !accessTokenSecret || !text)
      return res.status(400).end();

    const Twitter = new twitterAPIClient.TwitterClient({
      apiKey: credentials[req.params.username].consumerKey,
      apiSecret: credentials[req.params.username].consumerSecret,
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
