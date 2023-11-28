import { first } from "lodash";
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

  private handleCommand(
    command: string,
    msg: TelegramBot.Message,
    chatId: number
  ): void {
    switch (command) {
      case "/start":
        this.bot.sendMessage(
          chatId,
          `Hello ${msg.from?.first_name} I'm Kegha bot 👋, nice to meet you`
        );
        this.bot.sendMessage(
          chatId,
          `I can securely links Telegram accounts to BOS profiles, offering a seamless and effortless user identification experience.`
        );
        break;
      case "/help":
        this.bot.sendMessage(
          chatId,
          "Sure! Here are some available commands:\n/start - Start the bot\n/help - Display help",
          {
            reply_markup: {
              keyboard: [
                [{ text: "/start" }],
                [{ text: "/help" }],
                [{ text: "/map" }],
              ],
            },
          }
        );
        break;
      case "/map":
        this.bot.sendMessage(chatId, "Mapping in progress...");
        break;
      default:
        // catches commands that are not available
        this.bot.sendMessage(
          chatId,
          `Sorry, ${msg.from?.first_name} that command doesn't exist 😥. Here are some available commands:\n/start - Start the bot\n/help - Display help`
        );
        break;
    }
  }

  //listens to request made to /bot
  async listen() {
    console.log("Kegha Bot is listening 🚀...");
    this.bot.on("message", (msg) => {
      console.log(msg);
      const chatId = msg.chat.id;
      const userId = msg.from?.id;
      const isBot = msg.from?.is_bot;
      const firstName = msg.from?.first_name;

      // check if the user sends a message
      if (msg.text && msg.text.startsWith("/")) {
        const availableCommands = ["/start", "/help", "/map"];
        const command = msg.text.split(" ")[0];

        if (availableCommands.includes(command)) {
          this.handleCommand(command, msg, chatId);
        } else {
          this.bot.sendMessage(
            chatId,
            `Sorry, ${msg.from?.first_name} that command doesn't exist 😥. Here are some available commands:\n/start - Start the bot\n/help - Display help`
          );
        }
      } else {
        this.bot.sendMessage(
          chatId,
          `Sorry, ${firstName} that's not a valid command 😏, \n/help - Display help`
        );
      }
    });
  }
}

export default BotController;
