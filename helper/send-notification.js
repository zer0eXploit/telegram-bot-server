const fetch = require('node-fetch');

const sendNotification = (errorData) => {
  console.log(errorData);
  console.log('I am called!');
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
