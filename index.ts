import BotController from "./controllers/bot.controller";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

//listen to the bot

const app = express();
const PORT = process.env.PORT || 2800;

app.listen(PORT, () => {
  const bot = new BotController();
  bot.listen();
});
