import { Client, ActivityType, Partials } from "discord.js";
import { registerEvents, apiToken, envCheck, log, keys } from "utils";
import events from "botevents";
import process from "node:process";

import express from "express";
import Routes from "api";
export const app = express();

import http from "http";
import https from "https";

import rateLimit from "express-rate-limit";

import fs from "fs";

import jwt from "jsonwebtoken";

envCheck();

const client = new Client({
  shards: "auto",
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildBans",
    "GuildEmojisAndStickers",
    "GuildIntegrations",
    "GuildWebhooks",
    "GuildInvites",
    "GuildVoiceStates",
    "GuildPresences",
    "GuildMessages",
    "GuildMessageReactions",
    "GuildMessageTyping",
    "DirectMessages",
    "DirectMessageReactions",
    "DirectMessageTyping",
    "MessageContent",
    "GuildScheduledEvents",
    "AutoModerationConfiguration",
    "AutoModerationExecution",
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
  const admin = jwt.sign({ username: "admin" }, process.env.API_TOKEN);
  log(admin);

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
    log("HTTP API started and is running on port 8080");
  });

  httpsServer.listen(8443, () => {
    log("HTTPS API started and is running on port 8443");
  });
});
