import { Telegraf } from "telegraf";
import * as near from "near-api-js";
import { Mongo } from "@telegraf/session/mongodb";
import { Markup } from "telegraf";
import { parseNearAmount } from "near-api-js/lib/utils/format";

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

  async createWallet(bot: Telegraf, account: near.Account) {}

  async listen() {
    console.log("Kegha Bot is listening 🚀");

    const nearPrivateKey: any = process.env.NEAR_PRIVATE_KEY;

    let keyPairs: any = [];
    let pubKeys: any = [];
    const { keyStores, KeyPair } = near;
    const myKeyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(nearPrivateKey);
    const network = "mainnet";
    const KEYPOM_CONTRACT = "v2.keypom.near";

    await myKeyStore.setKey("mainnet", "emmysoft.near", keyPair);
    const connectionConfig = {
      networkId: network,
      keyStore: myKeyStore,
      nodeUrl: `https://rpc.${network}.near.org`,
      walletUrl: `https://wallet.${network}.near.org`,
      helperUrl: `https://helper.${network}.near.org`,
      explorerUrl: `https://explorer.${network}.near.org`,
    };

    const connection = await near.connect(connectionConfig);
    this.bot.command("get", async (ctx) => {
      try {
        if (!this.nearUsername) {
          return ctx.reply("Please login first");
        }

        // Initialize the contract
        this.contract = await new near.Contract(
          this.account,
          "v1.social08.testnet",
          {
            changeMethods: ["set"],
            viewMethods: ["get"],
          }
        );

        // Retrieve the profile
        const profile = await this.contract.get({
          keys: [`${this.nearUsername}.testnet/profile/**`],
        });

        // Log the retrieved profile
        console.log("Retrieved Profile:", profile);

        // Respond to the user with the retrieved profile data
        ctx.reply(`Retrieved Profile: ${JSON.stringify(profile)}`);
      } catch (error) {
        console.error("Error during profile retrieval:", error);
        ctx.reply("Error retrieving profile. Please try again.");
      }
    });

    this.bot.command("set", async (ctx) => {
      if (!this.nearUsername) {
        return ctx.reply("Please login first");
      }

      this.contract = await new near.Contract(
        this.account,
        "v1.social08.testnet",
        {
          changeMethods: ["set"],
          viewMethods: ["get"],
        }
      );
      const gas = "300000000000000";
      const deposit = "50000000000000000000000";
      //const username = `${this.nearUsername}.testnet`;
      try {
        const profile = await this.contract.set({
          args: {
            data: {
              "emmysoft.testnet": {
                profile: {
                  name: "Adedoyin Emmanuel",
                  image: {
                    url: "https://avatars.githubusercontent.com/u/88517758?v=4",
                  },
                },
              },
            },
          },
          gas: "300000000000000",
          amount: "1000000000000000000000000",
        });
        console.log(profile);
      } catch (error) {
        console.error("Error during contract set:", error);
      }
    });

    this.bot.command("start", async (ctx) => {
      ctx.reply(
        "Hi! Welcome to Kegha Bot 👋. Let me walk you through the process of creating your near wallet 🚀. Please enter a username you'd like to use"
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
      });
    });
  }
}

export default BotController;
