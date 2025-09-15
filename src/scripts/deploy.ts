import { REST, Routes, APIUser } from 'discord.js'
import commands from 'commands'
import { log } from 'utils'

const body = commands
    .map((cmd) => {
        return [cmd.meta]
    })
    .flat()
const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN)

async function main() {
    const currentUser = (await rest.get(Routes.user())) as APIUser

    if (process.env.NODE_ENV === 'production') {
        log('Production mode')
        const endpoint = {
            global: Routes.applicationCommands(currentUser.id),
            local: Routes.applicationGuildCommands(currentUser.id, process.env.GUILD),
        }

        return currentUser
    } else {
        log('Development mode')
        const endpoint = {
            global: Routes.applicationCommands(currentUser.id),
            local: Routes.applicationGuildCommands(currentUser.id, '1278051511087399114'),
        }
        await rest.put(endpoint.local, {
            body: body.map((cmd) => cmd),
        })

        await rest.put(endpoint.global, {
            body: [],
        })

        return currentUser
    }
}

main().catch(console.error)
