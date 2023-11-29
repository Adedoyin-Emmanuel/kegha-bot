const { BotController } = require("./controllers/bot.controller");
require("dotenv").config();

const bot = new BotController();

bot.listen();
