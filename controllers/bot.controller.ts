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
      const userId = msg.from?.id;
      const isBot = msg.from?.is_bot;

      console.log(`Chat Is is ${chatId} and Message Id is ${chatId}`);
      this.bot.sendMessage(
        chatId,
        `Hello ${msg.from?.first_name} I'm Kegha bot, nice to meet you`
      );
      this.bot.sendMessage(
        chatId,
        `I can securely links Telegram accounts to BOS profiles, offering a seamless and effortless user identification experience.`
      );
    });
  }
}

export default BotController;
