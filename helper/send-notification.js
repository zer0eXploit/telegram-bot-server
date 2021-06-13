const fetch = require('node-fetch');

const sendNotification = (errorData) => {
  const uri = process.env.TWEET_ERROR_WEBHOOK_URI;
  return fetch(uri, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(errorData),
  });
};

module.exports = sendNotification;
