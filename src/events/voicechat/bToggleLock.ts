import { errorLog, event, log } from 'utils'
import { db } from 'src/index'
import { VoiceChannelType } from 'src/types/voiceChannel'
import { ChannelType, PermissionFlagsBits, OverwriteResolvable } from 'discord.js'

export default event('interactionCreate', async ({ client }, Interaction) => {
    try {
        if (Interaction.user.bot) return
        if (!Interaction.isButton()) return
        if (Interaction.customId != 'toggle_lock') return
        if (!Interaction.guild) return

        const userChannel = db.query(`SELECT * FROM voicechannel WHERE ownerid = ${Interaction.user.id}`).get() as VoiceChannelType
        const guild = await Interaction.guild.fetch()
        const channel = await guild.channels.fetch(userChannel.channelid)

        if (!channel) return
        if (channel.type != ChannelType.GuildVoice) return

        if (!channel.members.find((user) => user.id == userChannel.ownerid)) return

        const everyonePerm = channel.permissionsFor(guild.roles.everyone)

        channel.permissionOverwrites.edit(guild.roles.everyone, {
            Connect: everyonePerm.has(PermissionFlagsBits.Connect) ? false : true,
        })

        channel.members.map((member) => {
            if (member.id == userChannel.ownerid) return

            const userPerm = channel.permissionsFor(member.user)
            channel.permissionOverwrites.edit(member.user, {
                Connect: userPerm ? false : true,
            })
        })

        await Interaction.reply({
            content: everyonePerm.has(PermissionFlagsBits.Connect) ? 'Channel Locked' : 'Channel Unlocked',
            flags: ['Ephemeral'],
        })
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
