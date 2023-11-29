const near = require("near-api-js");
const { keyStores, KeyPair } = near;
const myKeyStore = new keyStores.InMemoryKeyStore();
const { generateSeedPhrase } = require("near-seed-phrase");
const { Telegraf, Markup } = require("telegraf");

const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
const bot = new Telegraf("6730224944:AAFjQFzSw2jc5yLmzXs5UuZfrJZ3LQVQfE0");
const network = "testnet";
class BotController {
  constructor() {}

  async listen() {
    console.log("Kegha bot started 🚀");
    this.network = network;
    await myKeyStore.setKey(
      this.network,
      "emmysoft.testnet",
      "ed25519:4pdBpBMMJR86i6rtjBA6hVEi2wbJ7hHnaKsK7m77T4ogP7itk82EMGdjWXdwYhgnHaTFL96E5gA5QFW2q2MmX6XC"
    );
    const connectionConfig = {
      networkId: this.network,
      keyStore: myKeyStore,
      nodeUrl: `https://rpc.${this.network}.near.org`,
      walletUrl: `https://wallet.${this.network}.near.org`,
      helperUrl: `https://helper.${this.network}.near.org`,
      explorerUrl: `https://explorer.${this.network}.near.org`,
    };
    const connection = await near.connect(connectionConfig);
    const account = await connection.account("emmysoft.testnet");

    bot.command("start", (ctx) => {
      ctx.reply(
        "Welcome to Kegha 👋. Let me walk you through the process of creating your near wallet 🚀. Please enter a username you'd like to use"
      );

      bot.hears([/./], async (ctx) => {
        if (!/^[a-zA-Z0-9._-]+$/.test(ctx.message.text)) {
          return ctx.reply(
            "Invalid NEAR username. Please enter a valid username."
          );
        }

        if (!ctx.message.text) {
          return ctx.reply("Please enter a username");
        }

        //create the wallet for the user
        this.nearUsername = `${ctx.message.text}.testnet`;

        try {
          const args = {
            new_account_id: this.nearUsername.toLowerCase(),
            new_public_key: publicKey,
          };

          const result = await account.signAndSendTransaction({
            receiverId: "testnet",
            actions: [
              near.transactions.functionCall(
                "create_account",
                Buffer.from(JSON.stringify(args)),
                "30000000000000",
                "30000000000000000000000"
              ),
            ],
          });
          console.log(result);
          ctx.replyWithHTML(
            `Your wallet has been created successfully 🚀 You are logged in as <b>${this.nearUsername} ✅</b>`,
            Markup.inlineKeyboard([
              [
                Markup.button.url(
                  "View wallet 👜",
                  `https://explorer.testnet.near.org/accounts/${this.nearUsername}`
                ),
              ],
              [
                Markup.button.callback("Check Balance 💰", "check_balance"),
                Markup.button.callback("Help ❓", "help"),
              ],
              [
                Markup.button.callback("Update Profile 🧑", "update_profile"),
                Markup.button.callback("View Profile 🧑", "view_profile"),
              ],
            ])
          );
        } catch (error) {
          console.log(`An error occured 😞 ${error.message}`);
        }
      });
    });

    bot.launch();
  }
}

module.exports = { BotController };
