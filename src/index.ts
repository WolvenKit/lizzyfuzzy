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

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

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

  app.listen(3000, () => {
    console.log(`[${time}] `, "API started and is running on port 3000");
  });
});
