import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js'
import { command, settingsDB } from 'utils'
const meta = new ContextMenuCommandBuilder()
    .setName('Omit User as Pirate')
    .setType(ApplicationCommandType.User)

export default command(meta, async ({ interaction }) => {
    if (!interaction.isContextMenuCommand) return
    if (!interaction.isUserContextMenuCommand()) return
    if (!interaction.guild) return

    const User = interaction.targetUser

    const getUser = settingsDB
        .query(`SELECT * FROM markedMembers WHERE user = '${User.id}'`)
        .get()

    if (!getUser) {
        const setting_markedRole = settingsDB
            .query(
                `SELECT value FROM settings WHERE key = 'setting_markedMemberRole'`
            )
            .get() as { value: string }

        const role = interaction.guild.roles.cache.get(setting_markedRole.value)

        if (!role) {
            return interaction.reply({
                content: `The Marked Role is not set up yet.`,
                flags: 64,
            })
        }

        const guildMember = interaction.guild.members.cache.get(User.id)

        if (!guildMember) {
            return interaction.reply({
                content: `User is not in the server.`,
                flags: 64,
            })
        }

        guildMember.roles.remove(role)

        return interaction.reply({
            content: `User is not marked as a Pirate in the Database.\nTrying to remove role.`,
            flags: 64,
        })
    }

    const guildMember = interaction.guild.members.cache.get(User.id)

    if (!guildMember) {
        return interaction.reply({
            content: `User is not in the server.`,
            flags: 64,
        })
    }

    const setting_markedRole = settingsDB
        .query(
            `SELECT value FROM settings WHERE key = 'setting_markedMemberRole'`
        )
        .get() as { value: string }

    const role = interaction.guild!.roles.cache.get(setting_markedRole.value)

    if (!role) {
        return interaction.reply({
            content: `The Marked Role is not set up yet.`,
            flags: 64,
        })
    }

    guildMember.roles.remove(role)

    settingsDB
        .query(`DELETE FROM markedMembers WHERE user = '${User.id}'`)
        .run()

    interaction.reply({
        content: `User ${User.tag} has been cleared from the database.`,
        flags: 64,
    })
})
