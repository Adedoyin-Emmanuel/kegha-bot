const near = require("near-api-js");
const { keyStores, KeyPair } = near;
const myKeyStore = new keyStores.InMemoryKeyStore();
const { generateSeedPhrase } = require("near-seed-phrase");
const { Telegraf } = require("telegraf");

const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
class BotController {
  constructor() {
    this.network = "testnet";
  }

  async listen() {
    console.log("Kegha bot started 🚀");
    await myKeyStore.setKey(
      this.network,
      "emmysoft.testnet",
      process.env.NEAR_PRIVATE_KEY
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
        "Hi! Welcome to Kegha 👋. Let me walk you through the process of creating your near wallet 🚀. Please enter a username you'd like to use"
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
            new_account_id: this.nearUsername,
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
          ctx.reply("Your wallet has been created successfully 🚀");
        } catch (error) {
          console.log(`An error occured 😞 ${error.message}`);
        }
      });
    });

    bot.launch();
  }
}

module.exports = { BotController };
