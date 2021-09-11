require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const RedisStore = require("connect-redis")(session);

const connectRedisDB = require("./config/redis-db");

require("./helper/telegram-bot");

const app = express();

// Static Folder Setup
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.text());
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {},
    store: new RedisStore({ client: connectRedisDB() }),
  }),
);

// Routes
const homeRoute = require("./routes/home");
const iftttRoute = require("./routes/ifttt");
const twitterRoute = require("./routes/twitter");

app.use("/", homeRoute);
app.use("/ifttt", iftttRoute);
app.use("/twitter", twitterRoute);

const PORT = process.env.PORT || "3000";

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
