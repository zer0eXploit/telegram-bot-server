const { INTRODUCE } = require("./constants/regexps");

/**
 * @desc A command helper method that matches telegram bot command /introduce
 * @param {Object} bot - The telegram bot instance
 * @return {undefined} Returns nothing explictly.
 */
module.exports = (bot) => {
  bot.onText(INTRODUCE, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = `Hello <b>${msg.from.first_name} ${msg.from.last_name}</b>! I am just some bot.`;
    bot.sendMessage(chatId, resp, { parse_mode: "HTML" });
  });
};
