const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");

const token = process.env.BOT_API_KEY;

const bot = new TelegramBot(token, { polling: true });

const handleEcho = require("./commands/echo");
const introduce = require("./commands/introduce");
const respondGreet = require("./commands/respond-greet");
const handleTellAJoke = require("./commands/tell-a-joke");

// Introduction
introduce(bot);

// Responds to Greetings
respondGreet(bot);

// Matches "/echo and /echo [whatever]"
handleEcho(bot);

// Matches /tell_a_joke
handleTellAJoke(bot);

module.exports = bot;
