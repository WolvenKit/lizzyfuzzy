import { MessageFlags } from 'discord.js'
import { errorLog, event } from 'utils'

export default event('interactionCreate', async ({ client }, Interaction) => {
    try {
        if (Interaction.user.bot) return
        if (Interaction.isButton()) {
            const guild = await client.guilds.fetch(process.env.SUPPORT_GUILD)
            const moderatorRole = await guild.roles.fetch(process.env.SUPPORT_MODERATOR_ROLE)
            const User = await guild.members.fetch(Interaction.user.id)

            try {
                if (Interaction.customId == 'add_moderator') {
                    User.roles.add(moderatorRole!)
                    Interaction.reply({
                        content: 'role added',
                        flags: MessageFlags.Ephemeral,
                    })
                }
            } catch (e) {
                Interaction.reply({
                    content: `${e}`,
                    flags: MessageFlags.Ephemeral,
                })
            }

            try {
                if (Interaction.customId == 'remove_moderator') {
                    User.roles.remove(moderatorRole!)
                    Interaction.reply({
                        content: 'role removed',
                        flags: MessageFlags.Ephemeral,
                    })
                }
            } catch (e) {
                Interaction.reply({
                    content: `${e}`,
                    flags: MessageFlags.Ephemeral,
                })
            }
        }
    } catch (e) {
        errorLog(e)
    }
})
