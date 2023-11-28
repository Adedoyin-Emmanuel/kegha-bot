import { Telegraf } from "telegraf";
import * as near from "near-api-js";
// import { KeyPair } from "@near-js/crypto";
// import { InMemoryKeyStore } from "@near-js/keystores";
// import { actionCreators } from "@near-js/transactions";
// import BN from "bn.js";

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
    console.log("Kegha Bot is listening 🚀");

    const nearPrivateKey: any = process.env.NEAR_PRIVATE_KEY;
    const { keyStores, KeyPair } = near;
    const myKeyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(nearPrivateKey);

    await myKeyStore.setKey("testnet", "emmysoft.testnet", keyPair);
    const connectionConfig = {
      networkId: "testnet",
      keyStore: myKeyStore,
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };

    const connection = await near.connect(connectionConfig);

    this.bot.command("start", async (ctx) => {
      console.log(ctx);
      const firstName = ctx.from.first_name;
      ctx.reply(`Hi ${firstName}! Welcome to Kegha Bot 👋.`);
      await ctx.reply("Please enter your near id");
      this.bot.hears([/./], async (ctx) => {
        console.log(ctx.message.text);
        // if (!/^[a-zA-Z0-9._-]+$/.test(ctx.message.text)) {
        //   return ctx.reply(
        //     "Invalid NEAR username. Please enter a valid username."
        //   );
        // }
        this.account = await connection.account(`${ctx.message.text}.testnet`);
        if (!this.account) {
          ctx.reply("Please enter your near id");
        } else {
          this.nearUsername = ctx.message.text;
          ctx.reply(
            `You're logged in as ${this.account.accountId} 🚀, you've 💰 ${
              (await this.account.getAccountBalance()).available
            }`
          );
        }
      });
    });
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

      // const keyStore = new InMemoryKeyStore();
      // const privateKey = process.env.NEAR_PRIVATE_KEY as string;
      // await keyStore.setKey(
      //   process.env.NEXT_PUBLIC_NETWORK_ID as string,
      //   this.nearUsername,
      //   KeyPair.fromString(privateKey)
      // );

      // const signerAccount = await (this.nearUsername,
      // keyStore,
      // process.env.NEXT_PUBLIC_NETWORK_ID as string);
      // const gas = "300000000000000";
      // const deposit = "50000000000000000000000";

      // const args: any = {
      //   data: {
      //     [this.nearUsername]: {
      //       profile: {
      //         name: "Emmysoft",
      //         description: "I love coding",
      //         linktree: {
      //           telegram: "Dev",
      //         },
      //         image: {
      //           ipfs_cid:
      //             "https://avatars.githubusercontent.com/u/88517758?v=4",
      //         },
      //         tags: {
      //           dropwallet: "",
      //           near: "",
      //           genadrop: "",
      //         },
      //       },
      //     },
      //   },
      // };

      // const action = actionCreators.functionCall(
      //   "set",
      //   args,
      //   new BN(gas),
      //   new BN(deposit)
      // );

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

    this.bot.launch();
  }
}

export default BotController;
