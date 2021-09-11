const { ECHO } = require("./constants/regexps");

/**
 * @desc A handler that responds to /echo command.
 * @param {Object} bot - The telegram bot instance
 * @return {undefined} Returns nothing explictly.
 */
module.exports = (bot) => {
  bot.onText(ECHO, (msg, match) => {
    const chatId = msg.chat.id;
    if (!match[1]) {
      const resp = `Noob ${msg.from.first_name}! Look around to see how your peers use this command.`;
      bot.sendMessage(chatId, resp);
      bot.sendSticker(
        chatId,
        "CAACAgIAAxkBAAIBV2Bhs5MlzwqpjLzQo-5GY5LoIFogAALfAwACierlB7f0BxbkIl44HgQ",
      );
    } else {
      const resp = match[3]; // the captured "whatever"
      bot.sendMessage(chatId, resp);
    }
  });
};
