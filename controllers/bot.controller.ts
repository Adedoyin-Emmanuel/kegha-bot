import { Telegraf } from "telegraf";
import * as near from "near-api-js";
const { generateSeedPhrase } = require("near-seed-phrase");

class BotController {
  protected bot: Telegraf;
  protected account: near.Account;
  protected contract: near.Contract | any;
  protected nearUsername: string;

  constructor() {
    const telegramToken: any = process.env.TELEGRAM_TOKEN;
    this.bot = new Telegraf(telegramToken);
    this.account = {} as near.Account;
    this.contract = {} as near.Contract | any;
    this.nearUsername = "" as string;
  }

  async listen() {
    console.log("Kegha bot is listening 🚀");

    const nearPrivateKey: any = process.env.NEAR_PRIVATE_KEY;
    const { keyStores, KeyPair } = near;
    const myKeyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(nearPrivateKey);
    const network = "testnet";

    console.log("check", keyPair.getPublicKey().toString());

    await myKeyStore.setKey(network, "emmysoft.testnet", keyPair);

    const connectionConfig = {
      networkId: network,
      keyStore: myKeyStore,
      nodeUrl: `https://rpc.${network}.near.org`,
      walletUrl: `https://wallet.${network}.near.org`,
      helperUrl: `https://helper.${network}.near.org`,
      explorerUrl: `https://explorer.${network}.near.org`,
    };

    const connection = await near.connect(connectionConfig);
    const account = await connection.account("emmysoft.testnet");

    this.bot.command("start", (ctx) => {
      ctx.reply(
        "Hi! Welcome to Kegha 👋. Let me walk you through the process of creating your near wallet 🚀. Please enter a username you'd like to use"
      );

      this.bot.hears([/./], async (ctx) => {
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
        const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();

        try {
          const contractArgs = {
            new_account_id: this.nearUsername,
            new_public_key: publicKey,
          };

          const gas = "300000000000000";
          const initialFunds = "30000000000000000000000";

          const result = await account.signAndSendTransaction({
            receiverId: this.nearUsername,
            actions: [
              near.transactions.functionCall(
                "create_account",
                Buffer.from(JSON.stringify(contractArgs)),
                "30000000000000",
                "30000000000000000000000"
              ),
            ],
          });

          console.log("result", result);
          ctx.reply("Your wallet has been created successfully 🚀");
        } catch (error: any) {
          console.log(`An error occured 😞 ${error.message}`);
        }
      });
    });

    this.bot.launch();
  }
}

export default BotController;
