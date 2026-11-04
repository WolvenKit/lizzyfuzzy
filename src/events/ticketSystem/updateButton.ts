import { errorLog, event } from 'utils'
import {
    TextDisplayBuilder,
    ContainerBuilder,
    ActionRowBuilder,
    MessageActionRowComponentBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
} from 'discord.js'

export default event('interactionCreate', async ({ client }, Interaction) => {
    try {
        if (Interaction.user.bot) return
        if (!Interaction.isModalSubmit()) return
        if (Interaction.customId != 'ticket_modal') return

        const originalMessage = await Interaction.message?.fetch()

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    'Perfect! You have just opened a ticket with the following content:\n\n``` ' +
                        Interaction.fields.getTextInputValue('issue_text') +
                        '``` '
                )
            )
            .addActionRowComponents(
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true)
                            .setLabel('Open Ticket')
                            .setEmoji({ id: '1281304248168218724', name: 'cat_hi_animated' })
                            .setCustomId('start_ticket')
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(false)
                            .setLabel('Close Ticket')
                            .setEmoji({ id: '1307014888098500669', name: 'peepoBye' })
                            .setCustomId('close_ticket_DM')
                    )
            )

        await originalMessage?.edit({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        })
    } catch (e) {
        errorLog('updateButton ' + e)
    }
})
