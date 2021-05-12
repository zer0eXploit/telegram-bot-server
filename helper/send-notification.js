const fetch = require('node-fetch');

const sendNotification = (
  title,
  msg,
  priority = 1,
  link = null,
  linkTitle = null,
) => {
  return fetch('https://api.pushover.net/1/messages.json', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      token: process.env.PUSHOVER_NOTIFICATION_API,
      user: process.env.PUSHOVER_NOTIFICATION_USER_KEY,
      title: title,
      message: msg,
      priority: priority,
      url: link,
      url_title: linkTitle,
    }),
  });
};

module.exports = sendNotification;
