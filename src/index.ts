import { Client, ActivityType, Partials } from 'discord.js'
import { registerEvents, errorLog } from 'utils'
import events from 'botevents'
import { Database } from 'bun:sqlite'

import { createTable } from './scripts/database'

export const db = new Database('database.sqlite')

createTable()

const client = new Client({
    shards: 'auto',
    intents: [
        'Guilds',
        'GuildMembers',
        'GuildBans',
        'GuildEmojisAndStickers',
        'GuildIntegrations',
        'GuildWebhooks',
        'GuildInvites',
        'GuildVoiceStates',
        'GuildMessages',
        'GuildMessageReactions',
        'GuildMessageTyping',
        'DirectMessages',
        'DirectMessageReactions',
        'DirectMessageTyping',
        'MessageContent',
        'GuildScheduledEvents',
        'AutoModerationConfiguration',
        'AutoModerationExecution',
    ],
    presence: {
        activities: [
            {
                name: 'I put the bin into the bin.',
                type: ActivityType.Custom,
            },
        ],
    },
    partials: [Partials.Channel],
})

registerEvents(client, events)

client.login(process.env.CLIENT_TOKEN).catch((err) => {
    errorLog('[Login]', err)
    process.exit(1)
})
