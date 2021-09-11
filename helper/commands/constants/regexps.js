const botUsername = process.env.BOT_USERNAME;

const commands = {
  INTRODUCE: new RegExp(`^(\/introduce|\/introduce@${botUsername})`),
  GREETINGS: /^(Hello|Hi|Greetings|Greeting|Sup|Hey)/i,
  ECHO: new RegExp(
    `(^(\/echo|\/echo@${botUsername}) (.+))|^(\/echo|\/echo@${botUsername})$`,
  ),
  TELL_A_JOKE: new RegExp(`^(\/tell_a_joke|\/tell_a_joke@${botUsername})$`),
};

module.exports = commands;
