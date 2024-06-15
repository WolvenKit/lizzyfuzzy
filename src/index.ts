import { Client, GatewayIntentBits, ActivityType, Partials } from 'discord.js';
import { registerEvents } from './utils';
import events from './events';
import keys from './keys';
import process from 'node:process';

const client = new Client({
  shards: 'auto',
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
        name: 'Welcome darkness my old friend',
        type: ActivityType.Custom,
      },
    ],
  },
  partials: [Partials.Channel],
});

registerEvents(client, events);

client.login(keys.clientToken).catch(err => {
  console.error('[Login Error]', err);
  process.exit(1);
});
