const near = require("near-api-js");
const { keyStores, KeyPair } = near;
const myKeyStore = new keyStores.InMemoryKeyStore();
const { generateSeedPhrase } = require("near-seed-phrase");
const { Telegraf, Markup, session, Composer } = require("telegraf");
const { Mongo } = require("@telegraf/session/mongodb");
const { current } = require("@reduxjs/toolkit");

const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
let update = false;
let currentAction = "";

const network = "testnet";

const store = Mongo({
  url: "mongodb://127.0.0.1:27017",
  database: "telegraf-bot",
});

const bot = new Telegraf("6730224944:AAFjQFzSw2jc5yLmzXs5UuZfrJZ3LQVQfE0");
bot.use(session({ store }));

class BotController {
  constructor() {}

  async dashboardTemplate() {
    return Markup.inlineKeyboard([
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

      [
        Markup.button.callback("Logout 🚪", "logout"),
        Markup.button.callback("Settings ⚙️", "sesttings"),
      ],
    ]);
  }

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
    this.currentAction = currentAction;

    bot.command("start", async (ctx) => {
      ctx.reply(
        "Welcome to Kegha 👋. Let me walk you through the process of creating your near wallet 🚀. Please enter a username you'd like to use"
      );

      ctx.reply(
        "Please enter a username in the format /username <your username>"
      );

      bot.hears(/^\/username (.+)$/, async (ctx) => {
        if (!ctx.message.text) {
          return ctx.reply(
            "Please enter a username in the format username <your username>"
          );
        }

        const username = ctx.match[1];
        if (!username) {
          return ctx.reply("Please enter a valid username");
        }

        console.log(username);

        //create the wallet for the user
        this.nearUsername = `${username.toLowerCase()}.testnet`;

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

              [
                Markup.button.callback("Logout 🚪", "logout"),
                Markup.button.callback("Settings ⚙️", "sesttings"),
              ],
            ])
          );
        } catch (error) {
          console.log(`An error occured 😞 ${error.message}`);
        }
      });

      bot.action("check_balance", async (ctx) => {
        try {
          // Assume exchange rate (NEAR to USD) is 5
          const exchangeRate = 1;

          const account = await connection.account(this.nearUsername);
          const balance = await account.getAccountBalance();

          // Convert NEAR balance to USD
          const balanceInUsd = balance.available / exchangeRate;
          const replyMessage = `<b>${this.nearUsername} Balance 💰</b>\n\nMoney 💸:\n${balance.available} NEAR`;

          ctx.replyWithHTML(
            replyMessage,
            Markup.inlineKeyboard([
              [
                Markup.button.url(
                  "Transaction History 📚",
                  `https://explorer.testnet.near.org/accounts/${this.nearUsername}`
                ),
              ],

              [Markup.button.callback("Back ⬅️", "back")],
            ])
          );
        } catch (error) {
          console.error("Error checking balance:", error);
          ctx.reply(
            "An error occurred while checking the balance. Please try again later."
          );
        }
      });

      bot.action("back", async (ctx) => {
        ctx.replyWithHTML("<b>Dashboard</b>", await this.dashboardTemplate());
      });

      bot.action("update_profile", async (ctx) => {
        if (!this.nearUsername) {
          return ctx.reply(
            "You are not logged in. Please login to view your profile",
            Markup.button.botRequest("start")
          );
        }
        try {
          //map out different stages of the profile update

          ctx.replyWithHTML(
            `Select a field to update ✍️`,
            Markup.inlineKeyboard([
              [
                Markup.button.callback("Name", "update_name"),
                Markup.button.callback("About", "update_about"),
              ],
              [
                Markup.button.callback("Twitter", "update_twitter"),
                Markup.button.callback("Telegram", "update_telegram"),
              ],

              [Markup.button.callback("Profile Image", "update_image")],
            ])
          );

          //update = true;

          bot.action("update_name", async (ctx) => {
            ctx.reply("Please enter your name in the format /name <your name>");

            bot.hears(/^\/name (.+)$/, async (ctx) => {
              const profileUpdate = {
                name: ctx.match[1],
              };
              console.log(profileUpdate);
            });
          });

          bot.action("update_about", async (ctx) => {
            ctx.reply(
              "Please enter your about/bio in the format /about <your about>"
            );
            bot.hears(/^\/about (.+)$/, async (ctx) => {
              const profileUpdate = {
                about: ctx.match[1],
              };
              console.log(profileUpdate);
            });
          });

          bot.action("update_twitter", async (ctx) => {
            ctx.reply(
              "Please enter your twitter handle in the format, not URL /twitter <your twitter handle>"
            );
            bot.hears(/^\/twitter (.+)$/, async (ctx) => {
              const profileUpdate = {
                twitter: ctx.match[1],
              };
              console.log(profileUpdate);
            });
          });

          bot.action("update_telegram", async (ctx) => {
            ctx.reply(
              "Please enter your telegram handle in the format, not URL /telegram <your telegram handle>"
            );
            bot.hears(/^\/telegram (.+)$/, async (ctx) => {
              const profileUpdate = {
                telegram: ctx.match[1],
              };
              console.log(profileUpdate);
            });
          });

          bot.action("update_image", async (ctx) => {
            ctx.reply("Please upload your profile image");
            bot.on("photo", async (ctx) => {
              const profilePhoto = ctx.message.photo;

              // check if the user has uploaded a photo
              if (profilePhoto && profilePhoto.length > 0) {
                const fileId = profilePhoto[0].file_id;
                const fileURL = await bot.telegram.getFileLink(fileId);
                const filePath = fileURL.href;

                console.log(filePath);
              } else {
                ctx.reply("Please upload a valid image");
              }
            });
          });
        } catch (error) {
          console.log(error);
          ctx.reply("An error occured while updating your profile");
        }
      });

      bot.action("view_profile", async (ctx) => {
        if (!this.nearUsername) {
          return ctx.reply(
            "You are not logged in. Please login to view your profile",
            Markup.button.botRequest("start")
          );
        }
        try {
          const account = await connection.account(this.nearUsername);
          const CONTRACT_ID = "v1.social08.testnet";
          const contract = new near.Contract(account, CONTRACT_ID, {
            changeMethods: ["set"],
            viewMethods: ["get"],
          });

          const profile = await contract.get({
            keys: [`${this.nearUsername}/profile/**`],
          });

          if (!profile) {
            ctx.reply(
              "You have not set up your profile yet. Please update your profile",
              Markup.button.callback("Update Profile 🧑", "update_profile")
            );
          }

          const userProfile = profile[this.nearUsername].profile;
          const name = userProfile.name || "Name not provided";
          const about = userProfile.about || "About not provided";
          const twitter = userProfile.twitter || "Twitter not provided";
          const telegram = userProfile.telegram || "Telegram not provided";
          const image = userProfile.image && userProfile.image.url;

          let replyMessage = `<b>Your Profile Information</b>\n\nName: ${name}\nAbout: ${about}\nTwitter: ${twitter}\nTelegram: ${telegram}`;

          // Include the image in the reply if available
          if (image) {
            replyMessage += `\n\nImage: ${image}`;
          }

          ctx.replyWithHTML(
            replyMessage,
            Markup.inlineKeyboard([
              [
                Markup.button.url(
                  "View On Near Social 👨‍👩‍👧‍👦",
                  "https://near.social"
                ),
              ],
              [Markup.button.callback("Back ⬅️", "back")],
            ])
          );
        } catch (error) {
          console.log(error);
          ctx.reply("An error occured while fetching your profile");
        }
      });
    });

    bot.launch();
  }
}

module.exports = { BotController };
