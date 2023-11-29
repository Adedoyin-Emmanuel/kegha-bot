"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_controller_1 = __importDefault(require("./controllers/bot.controller"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//listen to the bot
const bot = new bot_controller_1.default();
bot.listen();
