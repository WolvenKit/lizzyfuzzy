import { ApplicationCommandType, ContextMenuCommandBuilder, MessageFlags } from 'discord.js'
import { command } from 'utils'
const meta = new ContextMenuCommandBuilder().setName('Get Avatar').setType(ApplicationCommandType.User)

export default command(meta, async ({ interaction }) => {
    if (!interaction.isUserContextMenuCommand() || !interaction.guild || interaction.user.bot) return

    interaction.reply({
        content: interaction.targetUser.displayAvatarURL(),
        flags: MessageFlags.Ephemeral,
    })
})
