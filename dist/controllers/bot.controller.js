"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const near = __importStar(require("near-api-js"));
class BotController {
    constructor() {
        const telegramToken = process.env.TELEGRAM_TOKEN;
        this.bot = new telegraf_1.Telegraf(telegramToken);
        this.account = {};
        this.contract = {};
        this.nearUsername = "";
    }
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Kegha bot is listening 🚀");
            const nearPrivateKey = process.env.NEAR_PRIVATE_KEY;
            const { keyStores, KeyPair } = near;
            const myKeyStore = new keyStores.InMemoryKeyStore();
            const keyPair = KeyPair.fromString(nearPrivateKey);
            const network = "testnet";
            console.log("check", keyPair.getPublicKey().toString());
            yield myKeyStore.setKey(network, "emmysoft.testnet", keyPair);
            const connectionConfig = {
                networkId: network,
                keyStore: myKeyStore, // first create a key store
                nodeUrl: `https://rpc.${network}.near.org`,
                walletUrl: `https://wallet.${network}.near.org`,
                helperUrl: `https://helper.${network}.near.org`,
                explorerUrl: `https://explorer.${network}.near.org`,
            };
            const connection = yield near.connect(connectionConfig);
            const account = yield connection.account("emmysoft.testnet");
            this.bot.command("/start", (ctx) => {
                ctx.reply("Hi! Welcome to Kegha 👋. Let me walk you through the process of creating your near wallet 🚀. Please enter a username you'd like to use");
                this.bot.hears([/./], (ctx) => __awaiter(this, void 0, void 0, function* () {
                    if (!/^[a-zA-Z0-9._-]+$/.test(ctx.message.text)) {
                        return ctx.reply("Invalid NEAR username. Please enter a valid username.");
                    }
                    if (!ctx.message.text) {
                        return ctx.reply("Please enter a username");
                    }
                    //create the wallet for the user
                    this.nearUsername = `${ctx.message.text}.testnet`;
                    try {
                        const contractArgs = {
                            new_account_id: this.nearUsername,
                            new_public_key: keyPair.getPublicKey().toString(),
                        };
                        const gas = "300000000000000";
                        const initialFunds = "30000000000000000000000";
                        const result = yield account.signAndSendTransaction({
                            receiverId: network,
                            actions: [
                                near.transactions.functionCall("create_account", Buffer.from(JSON.stringify(contractArgs)), "30000000000000", "30000000000000000000000"),
                            ],
                        });
                        console.log("result", result);
                        ctx.reply("Your wallet has been created successfully 🚀");
                    }
                    catch (error) {
                        console.log(`An error occured 😞 ${error.message}`);
                    }
                }));
            });
        });
    }
}
exports.default = BotController;
