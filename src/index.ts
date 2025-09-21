import { Client, ActivityType, Partials } from 'discord.js'
import {
    registerEvents,
    errorLog,
    prepareStart,
    prepareDatabase,
    populateDatabase,
    updateSetting,
    log,
    generateTypes,
} from 'utils'
import events from 'botevents'
import { server } from 'api'

await prepareStart()
prepareDatabase()
populateDatabase()
await updateSetting()
generateTypes()

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
        'GuildPresences',
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

server.listen(8000, () => {
    log('Server running at https://localhost:8080/')
})

export default [client]
