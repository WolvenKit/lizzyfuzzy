import { Client, GatewayIntentBits, ActivityType, Partials } from "discord.js";
import { registerEvents, apiToken, envCheck } from "./utils";
import events from "./events";
import keys from "./keys";
import process from "node:process";

import express from "express";
import Routes from "./api/index";
export const app = express();

import http from "http";
import https from "https";

import rateLimit from "express-rate-limit";

import fs from "fs";

envCheck();

// Time value for logging
const time = new Date().toLocaleTimeString("en-US", {
  hour12: true,
  timeStyle: "medium",
});

const client = new Client({
  shards: "auto",
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
  ],
  presence: {
    activities: [
      {
        name: "I put the bin into the bin.",
        type: ActivityType.Custom,
      },
    ],
  },
  partials: [Partials.Channel],
});

registerEvents(client, events);

client.login(keys.clientToken).catch((err) => {
  console.error("[Login Error]", err);
  process.exit(1);
});

export default client;

client.on("ready", () => {
  const privateKey = fs.readFileSync("./src/keys/privkey.pem", "utf-8");
  const certificate = fs.readFileSync("./src/keys/fullchain.pem", "utf-8");

  const credentials = { key: privateKey, cert: certificate };

  app.get("/", (rq, rs) => {
    rs.redirect("/api");
  });

  const windowMS = Number(process.env.API_RATE_WINDOW) * 1000 || 60 * 1000;
  const requests = Number(process.env.API_MAX_REQUESTS) || 10;

  const limit = rateLimit({
    windowMs: windowMS, // 1 minute
    max: requests, // 10 requests,
    message: "You are being rate limited",
  });

  app.use(limit);
  app.use(express.json());

  app.use(apiToken);
  app.use("/api", Routes);

  const httpServer = http.createServer(app);
  const httpsServer = https.createServer(credentials, app);

  httpServer.listen(8080, () => {
    console.log(`[${time}] `, "HTTP API started and is running on port 8080");
  });

  httpsServer.listen(8443, () => {
    console.log(`[${time}] `, "HTTPS API started and is running on port 8443");
  });
});
