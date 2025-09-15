import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import type { TextChannel } from 'discord.js'
import { command, errorLog } from 'utils'

const meta = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('clear chat')
    .addNumberOption((num) =>
        num.setName('limit').setDescription('The maximum of messages deleted at once. Default 100.').setMaxValue(100).setMinValue(0)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

function isOlderThan14Days(timestamp) {
    const now = Date.now() // current time in ms
    const fourteenDays = 14 * 24 * 60 * 60 * 1000 // 14 days in ms
    return now - timestamp > fourteenDays
}

export default command(meta, async ({ interaction }) => {
    try {
        if (!interaction.channel?.isTextBased()) return
        if (interaction.isAutocomplete()) return

        const number = interaction.options.getNumber('limit', false)

        const messages = await interaction.channel?.messages.fetch({
            limit: number || 100,
            cache: false,
        })

        if (isOlderThan14Days(messages?.first()?.createdTimestamp) || isOlderThan14Days(messages?.last()?.createdTimestamp)) {
            return interaction.reply({
                content: 'The first or last message is older than 14 days old and thus cant be deleted. Limit your reach.',
                flags: MessageFlags.Ephemeral,
            })
        }

        if (messages) {
            if (interaction.channel?.isTextBased()) {
                ;(interaction.channel as TextChannel).bulkDelete(messages)
                interaction.reply({
                    content: 'Chat cleared!',
                    flags: MessageFlags.Ephemeral,
                })
            }
        }
    } catch (e) {
        errorLog(e)
    }
})
