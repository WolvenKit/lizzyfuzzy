import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js'
import type { UserContextMenuCommandInteraction } from 'discord.js'
import { command } from 'utils'
const meta = new ContextMenuCommandBuilder()
    .setName('Get Avatar')
    .setType(ApplicationCommandType.User)

export default command(meta, async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return
    if (!interaction.guild) return
    if (interaction.user.bot) return

    const Interaction = interaction as any as UserContextMenuCommandInteraction

    interaction.reply({
        content: Interaction.targetUser.displayAvatarURL(),
    })
})
