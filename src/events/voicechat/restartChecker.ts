import { event, log, errorLog } from 'utils'
import { db } from 'src/index'
import { VoiceChannelType, VoiceChannelControler } from 'src/types/voiceChannel'
import { ChannelType } from 'discord.js'

export default event('clientReady', async ({}, client) => {
    setTimeout(async () => {
        const guilds = await client.guilds.fetch()

        guilds.forEach(async (guild) => {
            const thisGuild = await guild.fetch()

            if (!thisGuild) return

            const controller = db.query(`SELECT * FROM voicechatcontroller WHERE guildid = ${thisGuild.id}`).get() as VoiceChannelControler

            if (!controller) return

            const category = await thisGuild.channels.fetch(controller.categoryid)
            if (!category || category.type != ChannelType.GuildCategory) return

            const channelChildren = category.children.cache
            channelChildren.map((channel) => {
                if (!channel.isVoiceBased()) return
                if (channel.members.size != 0) return

                const channelData = db.query(`SELECT * FROM voicechannel WHERE channelid = ${channel.id}`).get() as VoiceChannelType
                if (!channelData) return

                const createdTime = Number(channelData.createdtime)
                const currentTime = new Date(Date.now()).getTime()

                const differenceInSeconds = Number(((currentTime - createdTime) / 1000).toFixed(0))

                if (differenceInSeconds < 60) return
                if (!channel.deletable) return

                if (!channel) return

                channel.delete()

                db.prepare(`DELETE FROM voicechannel WHERE channelid = ${channel.id}`).run()
            })
        })
    }, 1)
})
