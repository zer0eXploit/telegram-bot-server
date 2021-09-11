const { GREETINGS } = require("./constants/regexps");

/**
 * @desc A handler that responds to common greeting texts like hello, hi etc.
 * @param {Object} bot - The telegram bot instance
 * @return {undefined} Returns nothing explictly.
 */
module.exports = (bot) => {
  bot.onText(GREETINGS, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = `${match[0][0].toUpperCase() + match[0].slice(1)} ${
      msg.from.first_name
    }!`;
    bot.sendMessage(chatId, resp);
  });
};
