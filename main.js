require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_API_KEY;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Introduction
bot.onText(/^(\/introduce|\/introduce@zer0exploit_rhm_bot)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = `Hello <b>${msg.from.first_name} ${msg.from.last_name}</b>! My name is as you know. I am created by my master <b>Bro Pann</b>, the almighty. All hail Bro Pann!`;
  bot.sendMessage(chatId, resp, { parse_mode: 'HTML' });
});

// Responds to Greetings
bot.onText(/^(Hello|Hi|Greetings|Greeting|Sup|Hey)/i, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = `${match[0][0].toUpperCase() + match[0].slice(1)} ${
    msg.from.first_name
  }!`;
  bot.sendMessage(chatId, resp);
});

// Matches "/echo [whatever]"
bot.onText(/^(\/echo|\/echo@zer0exploit_rhm_bot) (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[2]; // the captured "whatever"
  bot.sendMessage(chatId, resp);
});

// Matches /echo, just to have fun
bot.onText(/^(\/echo|\/echo@zer0exploit_rhm_bot)$/, (msg) => {
  const chatId = msg.chat.id;
  const resp = `Noob ${msg.from.first_name}! Look around to see how your peers use this command.`;

  bot.sendMessage(chatId, resp);
  bot.sendSticker(
    chatId,
    'CAACAgIAAxkBAAIBV2Bhs5MlzwqpjLzQo-5GY5LoIFogAALfAwACierlB7f0BxbkIl44HgQ',
  );
});

// Matches /crph_donations_update
bot.onText(
  /^(\/crph_donations_update|\/crph_donations_update@zer0exploit_rhm_bot)$/,
  async (msg) => {
    const chatId = msg.chat.id;
    try {
      const response = await fetch(
        `${process.env.BACKEND_URI}/send_crph_updates?channel_id=${chatId}`,
      );

      if (response.status !== 200) {
        throw new Error('Something went wrong on the origin servers.');
      }
    } catch (error) {
      bot.sendMessage(chatId, error.message);
    }
  },
);

// Matches /steam_10_bestsellers
bot.onText(
  /^(\/steam_10_bestsellers|\/steam_10_bestsellers@zer0exploit_rhm_bot)$/,
  async (msg) => {
    const chatId = msg.chat.id;
    try {
      const response = await fetch(
        `${process.env.BACKEND_URI}/steam_bestsellers?chat_id=${chatId}`,
      );

      if (response.status !== 200) {
        throw new Error('Something went wrong on the origin servers.');
      }
    } catch (error) {
      bot.sendMessage(chatId, error.message);
    }
  },
);

// Matches /tell_a_joke
bot.onText(
  /^(\/tell_a_joke|\/tell_a_joke@zer0exploit_rhm_bot)$/,
  async (msg) => {
    const chatId = msg.chat.id;
    try {
      const response = await fetch(`${process.env.JOKE_API_URI}`);

      if (response.status !== 200) {
        throw new Error('Something went wrong on the origin servers.');
      }

      if (response.status === 200) {
        const joke = await response.json();
        const message = `<b>Set Up</b>: ${joke.setup}\n<b>Punch line</b>: <i>${joke.punchline}</i>\n\n<i>Tip: If you didn't understand this joke, just accept the fact that you're dumb and move on. :)</i>`;
        bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
      }
    } catch (error) {
      bot.sendMessage(chatId, error.message);
    }
  },
);

app.get('/', (req, res) => {
  res.send('<h1>Hello!</h1>');
});

const PORT = process.env.PORT || '3000';
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
