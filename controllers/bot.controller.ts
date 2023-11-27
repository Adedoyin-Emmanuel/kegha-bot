import TelegramBot from "node-telegram-bot-api";

class BotController {
  /*
     @route GET /bot/
    Sends hello to client 

  */
  protected bot: TelegramBot;
  constructor() {
    const telegramToken: any = process.env.TELEGRAM_TOKEN;
    this.bot = new TelegramBot(telegramToken, { polling: true });
  }

  //listens to request made to /bot
  async listen() {
    console.log("Bot is listening");
    this.bot.on("message", (msg) => {
      console.log(msg);
      const chatId = msg.chat.id;

      console.log(chatId);
    });
  }
}

export default BotController;
