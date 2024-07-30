import { Client, GatewayIntentBits, ActivityType, Partials } from "discord.js";
import { registerEvents } from "./utils";
import events from "./events";
import keys from "./keys";
import process from "node:process";

import express from "express";
import Routes from "./api/index";
export const app = express();

import rateLimit from "express-rate-limit";

import apiToken from "./utils/apiToken";

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
  app.get("/", (rq, rs) => {
    rs.redirect("/api");
  });

  const windowMS = Number(process.env.APi_Rate_Window) * 1000 || 60 * 1000;
  const requests = Number(process.env.API_Max_Requests) || 10;

  const limit = rateLimit({
    windowMs: windowMS, // 1 minute
    max: requests, // 10 requests,
    message: "You are being rate limited",
  });

  app.use(limit);
  app.use(express.json());

  app.use(apiToken);
  app.use("/api", Routes);

  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
});
