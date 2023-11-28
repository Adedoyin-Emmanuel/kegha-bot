import { BotController } from "./controllers";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 2800;
const app = express();

//listen to the bot

app.listen(PORT, () => {
  const bot = new BotController();
  bot.listen();
});
