const { BotController } = require("./controllers/bot.controller");
const express = require("express");
const app = express();
require("dotenv").config();

const bot = new BotController();
const PORT = process.env.PORT || 3000;

/*
Create a server and start the bot process in it.
Hopefully it would prevent render from killing the bot standalone process
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  bot.listen();
});
