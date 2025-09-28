import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js'
import { MessageContextMenuCommandInteraction, MessageFlags } from 'discord.js'
import { command } from 'utils'

const meta = new ContextMenuCommandBuilder()
    .setName('Get Single Emoji')
    .setType(ApplicationCommandType.Message)

export default command(meta, async ({ interaction }) => {
    if (!interaction.isContextMenuCommand()) return
    if (!interaction.guild) return
    if (!interaction.isMessageContextMenuCommand) return

    const Interaction =
        interaction as unknown as MessageContextMenuCommandInteraction

    const match = Interaction.targetMessage?.content
        .match(/(<a?:\w+:(\d+)>)/g)
        ?.map((m) => {
            const match = m.match(/<(a?):\w+:(\d+)>/)
            if (match) {
                const isAnimated = match[1] === 'a'
                const id = match[2]
                return `https://cdn.discordapp.com/emojis/${id}.${
                    isAnimated ? 'gif' : 'webp'
                }`
            }
            return null
        })
        .filter((url): url is string => url !== null)

    if (!match) {
        return await Interaction.reply({
            content: 'No emoji found in the message.',
            flags: MessageFlags.Ephemeral,
        })
    }

    const emojiUrls = match.join('\n')
    await Interaction.reply({
        content: emojiUrls,
        flags: MessageFlags.Ephemeral,
    })
})
