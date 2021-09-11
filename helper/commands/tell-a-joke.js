const fetch = require("node-fetch");

const { TELL_A_JOKE } = require("./regexps");

/**
 * @desc A command helper method that matches telegram bot command /tell_a_joke
 * @param {Object} bot - The telegram bot instance
 * @return {undefined} Returns nothing explictly.
 */
module.exports = (bot) => {
  bot.onText(TELL_A_JOKE, async (msg) => {
    try {
      const { id } = msg.chat;
      const jokesAPI = process.env.JOKE_API_URI;
      const response = await fetch(jokesAPI);

      if (response.status !== 200) {
        throw new Error("Something went wrong on the origin servers.");
      }

      if (response.status === 200) {
        const joke = await response.json();
        const message = `<b>Set Up</b>: ${joke.setup}\n<b>Punch line</b>: <i>${joke.delivery}</i>`;
        bot.sendMessage(id, message, { parse_mode: "HTML" });
      }
    } catch (error) {
      bot.sendMessage(id, error.message);
    }
  });
};
