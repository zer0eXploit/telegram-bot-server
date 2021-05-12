const twitterAPIClient = require('twitter-api-client');

const twitterClient = new twitterAPIClient.TwitterClient({
  apiKey: process.env.TWITTER_API_KEY,
  apiSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_DEV_ACC_TOKEN,
  accessTokenSecret: process.env.TWITTER_DEV_ACC_SECRET,
});

module.exports = twitterClient;
