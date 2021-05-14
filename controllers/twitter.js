const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const twitterAPIClient = require('twitter-api-client');

const sendNotification = require('../helper/send-notification');

const credentials = {
  psst: {
    consumerKey: process.env.PSST_TWITTER_API_KEY,
    consumerSecret: process.env.PSST_TWITTER_API_SECRET,
  },
  hmnoo: {
    consumerKey: process.env.HMNOO_TWITTER_API_KEY,
    consumerSecret: process.env.HMNOO_TWITTER_API_SECRET,
  },
};

// @desc    Handles Login via Twitter
// @route   GET /twitter/login/:username
// @access  Private
exports.twitterLogin = (req, res) => {
  if (!credentials[req.params.username])
    return res.status(404).json({
      success: false,
      error: 'User not found.',
    });

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: credentials[req.params.username].consumerKey,
        consumerSecret: credentials[req.params.username].consumerSecret,
        callbackURL: process.env.TWITTER_CALLBACK_URL,
      },
      async function (token, tokenSecret, profile, done) {
        const notiTitle = `${profile.displayName}'s Twitter Credentials`;
        const message = `Token - ${token} \nSecret - ${tokenSecret}`;
        const priority = 1;
        await sendNotification(notiTitle, message, priority);
        done(null, {});
      },
    ),
  );

  return passport.authenticate('twitter')(req, res);
};

// @desc    Handles callback from twitter
// @route   GET /twitter/callback
// @access  Public
exports.twitterCallback = (req, res) => {
  return passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/failed',
    session: false,
  })(req, res);
};

// @desc    Handles callback from twitter
// @route   POST /twitter/tweet-for/:username
// @access  Private
exports.tweetForYou = async (req, res) => {
  if (!credentials[req.params.username])
    return res.status(404).json({
      success: false,
      error: 'User not found.',
    });

  try {
    const [accessToken, accessTokenSecret, text] =
      req.body.split(' @splitter ');

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
    const notiTitle = `Error tweeting for ${req.params.username}`;
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
