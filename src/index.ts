import { Client, ActivityType, Partials } from 'discord.js'
import {
    registerEvents,
    errorLog,
    log,
    generateTypes,
    db,
    readSQL,
    firstStart,
    fromDir,
} from 'utils'
import events from 'botevents'
import { server } from 'api'

generateTypes()

const data = readSQL().postgresInit

await db.unsafe(data)

await firstStart()

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

const cert = fromDir('./src/resources/Api', '.crt')
const key = fromDir('./src/resources/Api', '.key')

if (cert && key) {
    server.listen(8000, () => {
        log('Server running at https://localhost:8000/')
    })
} else {
    server.listen(8000, () => {
        log('Server running at http://localhost:8000/')
    })
    // errorLog('API SSL Certificate or Key not found. Server not started.')
}

export default [client]
