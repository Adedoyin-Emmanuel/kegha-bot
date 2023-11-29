import BotController from "./controllers/bot.controller";
import dotenv from "dotenv";
dotenv.config();


//listen to the bot

const bot = new BotController();
bot.listen();
