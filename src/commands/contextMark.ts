import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js'
import type { TextChannel } from 'discord.js'
import { command, settingsDB } from 'utils'
const meta = new ContextMenuCommandBuilder()
    .setName('Tag as Pirate')
    .setType(ApplicationCommandType.User)

export default command(meta, async ({ interaction }) => {
    if (!interaction.isContextMenuCommand) return
    if (!interaction.isUserContextMenuCommand()) return

    const User = interaction.targetUser

    const setting_markedMembersChannel = settingsDB
        .query(`SELECT value FROM settings WHERE key = 'markedMembersChannel'`)
        .get() as { value: string }

    const channel = interaction.guild!.channels.cache.get(
        setting_markedMembersChannel.value
    ) as TextChannel

    if (!channel) {
        return interaction.reply(
            'The Marked Members Channel is not set up yet.'
        )
    }

    const getUserFromDB = settingsDB
        .query(`SELECT * FROM markedMembers WHERE user = '${User.id}'`)
        .get()
    if (getUserFromDB) {
        settingsDB.close()
        return interaction.reply({
            content: `User is already marked as a Pirate.`,
            flags: 64,
        })
    }

    const message = await channel.send({
        embeds: [
            {
                title: 'Pirate Marked',
                fields: [
                    {
                        name: 'User',
                        value: User.toString(),
                        inline: true,
                    },
                    {
                        name: 'Marker',
                        value: interaction.user.toString(),
                        inline: true,
                    },
                ],
                color: 0x660066,
            },
        ],
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 4,
                        label: 'Mark',
                        custom_id: `pirate_mark_${User.id}`,
                    },
                    {
                        type: 2,
                        style: 2,
                        label: 'Ignore',
                        custom_id: `pirate_ignore_${User.id}`,
                    },
                ],
            },
        ],
    })

    settingsDB
        .query(
            `INSERT OR IGNORE INTO markedMembers (user, message, channel, messageid) VALUES (?, ?, ?, ?)`
        )
        .all(User.id, '', channel.id, message.id)

    return interaction.reply({
        content: `User has been marked as a Pirate.`,
        flags: 64,
    })
})
