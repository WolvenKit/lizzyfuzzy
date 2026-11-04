import { errorLog, event } from 'utils'
import { db } from 'src/index'
import type { TextChannel } from 'discord.js'
import type { Channel } from 'src/types/database'

export default event('messageCreate', async ({ client }, Interaction) => {
    try {
        if (Interaction.author.bot) return
        if (!Interaction.channel.isTextBased()) return

        const channel = Interaction.channel as TextChannel

        if (!channel.parent) return
        if (channel.parentId != process.env.OPEN_TICKET_CATEGORY) return

        const userdata = db.query(`SELECT * FROM channels WHERE channelid = ${channel.id}`).get() as Channel | null

        if (!userdata) return

        const DMChannel = await (await client.users?.fetch(userdata.discordid)).createDM()

        DMChannel.send({
            content: `${Interaction.author.displayName}: ${Interaction.content}`,
        })
    } catch (e) {
        errorLog(e)
    }
})
