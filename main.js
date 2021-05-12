require('dotenv').config();

const express = require('express');

const TelegramBot = require('./helper/telegram-bot');
const app = express();

// Static Folder Setup
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.text());

// Routes
const homeRoute = require('./routes/home');
const iftttRoute = require('./routes/ifttt');

app.use('/', homeRoute);
app.use('/ifttt', iftttRoute);

const PORT = process.env.PORT || '3000';

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
