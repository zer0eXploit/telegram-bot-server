const fetch = require("node-fetch");

const sendNotification = (message) => {
  const uri = process.env.IFTTT_WEBHOOK_URL;
  return fetch(uri, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

module.exports = sendNotification;
