import { errorLog, event, log } from 'utils'
import { db } from 'src/index'
import { VoiceChannelControler } from 'src/types/voiceChannel'
import { ChannelType, OverwriteResolvable, PermissionFlagsBits } from 'discord.js'

export default event('interactionCreate', async ({ client }, Interaction) => {
    try {
        if (Interaction.user.bot) return
        if (!Interaction.isButton()) return
        if (Interaction.customId != 'create_channel') return

        const controller = db.query(`SELECT * FROM voicechatcontroller WHERE guildid = ${Interaction.guildId}`).get() as VoiceChannelControler
        const user = Interaction.user
        const guild = await client.guilds.fetch(controller.guildid)
        const channel = Interaction.channel
        const everyonerole = Interaction.guild?.roles.everyone
        const moderatorrole = await guild.roles.fetch(controller.moderatorrole)

        if (!everyonerole || !moderatorrole) return
        if (!channel?.isTextBased()) return
        if (channel.type != ChannelType.GuildText) return

        const category = channel.parent
        if (!category) return

        let OverrideData = [
            {
                id: moderatorrole,
                allow: [PermissionFlagsBits.Connect],
            },
            {
                id: Interaction.user,
                allow: [PermissionFlagsBits.Connect],
            },
        ] as OverwriteResolvable[]

        if (controller.minrole) {
            OverrideData.push(
                {
                    id: controller.minrole,
                    allow: [PermissionFlagsBits.Connect],
                },
                {
                    id: everyonerole,
                    deny: [PermissionFlagsBits.Connect],
                }
            )
        }

        const newChannel = await category.children.create({
            name: user.displayName + 's-channel',
            nsfw: false,
            type: ChannelType.GuildVoice,
            permissionOverwrites: OverrideData,
        })

        const time = new Date(Date.now()).getTime().toString()

        const insert = db.prepare(`INSERT INTO voicechannel (ownerid, channelid, createdtime) VALUES ($ownerid, $channelid, $createdtime)`).run({
            ownerid: Interaction.user.id,
            channelid: newChannel.id,
            createdtime: time,
        })

        setTimeout(() => {
            const currentTime = new Date(Date.now()).getTime()
            const createTime = Number(time)

            const differenceInSeconds = Number(((currentTime - createTime) / 1000).toFixed(0))

            if (newChannel.members.size > 0) return

            if (differenceInSeconds < 60) return
            if (!newChannel.deletable) return

            log('Voice Channel' + newChannel.id + 'has timed out and been deleted.')

            if (!newChannel) return

            newChannel.delete()
            db.prepare(`DELETE FROM voicechannel WHERE channelid = ${channel.id}`).run()
        }, 60000)

        if (insert.changes == 0 && newChannel) {
            return await Interaction.reply({
                content: 'New Channel created but there has been problems with the database. Please contact <@220278978898821121>.',
                flags: 'Ephemeral',
            })
        } else if (insert.changes == 0 && newChannel) {
            return await Interaction.reply({
                content: 'There has been a problem in the creation. Please contact <@220278978898821121>.',
                flags: 'Ephemeral',
            })
        }

        return await Interaction.reply({
            content: 'New Channel created. You have 60 seconds to join until the channel will be deleted again.',
            flags: 'Ephemeral',
        })
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
