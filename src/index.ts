import { Client, ActivityType, Partials } from "discord.js";
import { registerEvents, keys, errorLog, prepareStart } from "utils";
import events from "botevents";

try {
  const APICheck = await fetch("http://localhost:3000/ping", {
    method: "GET",
  });

  if (APICheck.status !== 200) {
    // Kill the Bot if the API is not available.
    console.error("API is not available");
  }
} catch (error) {
  console.error("API is not available");
}
await prepareStart();

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
  errorLog("[Login]", err);
  process.exit(1);
});

export default [client];
