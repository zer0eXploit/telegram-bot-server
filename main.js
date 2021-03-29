require('dotenv').config();

const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_API_KEY;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Introduction
bot.onText(/^(\/introduce|\/introduce@zer0exploit_rhm_bot)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = `Hello <b>${msg.from.first_name} ${msg.from.last_name}</b>! My name is as you know. I am created by my master <b>Bro Pann</b>, the almighty. Long hail Bro Pann!`;
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
