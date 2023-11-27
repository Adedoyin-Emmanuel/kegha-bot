import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import { BotController } from "./controllers";
import http from "http";
import { initSocket } from "./sockets/socket.server";
dotenv.config();

const PORT = process.env.PORT || 2800;
const app = express();
const server = http.createServer(app);

initSocket(server);

//middlewares
const allowedOriginPatterns = [/http:\/\/localhost:3000$/];

const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Check if the origin matches any of the patterns
    if (
      !origin ||
      allowedOriginPatterns.some((pattern) => pattern.test(origin))
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

//endpoints
server.listen(PORT, () => {
  // start the bot
  const bot = new BotController();
  console.log(`Server running on port ${PORT}`);
  bot.listen();
});
