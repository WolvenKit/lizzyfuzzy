import { errorLog, event } from 'utils'

import { ModalBuilder, TextDisplayBuilder, LabelBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

export default event('interactionCreate', async ({ client }, Interaction) => {
    try {
        if (Interaction.user.bot) return
        if (Interaction.isButton()) {
            if (Interaction.customId != 'start_ticket') return

            const modal = new ModalBuilder()
                .setTitle('Support System')
                .setCustomId('ticket_modal')
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        'Welcome to the ticket support creation.\nPlease read the headlines and description carefully.\nIf you have trouble with modding, refer to the support channels on the main discord.\n\n__**This is not a troubleshooting server.**__ '
                    )
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel('List your Issue')
                        .setDescription('If you have been banned or muted this is the place to tell this to us.')
                        .setTextInputComponent(new TextInputBuilder().setCustomId('issue_text').setStyle(TextInputStyle.Paragraph))
                )

            Interaction.showModal(modal)
        }
    } catch (e) {
        errorLog(e)
    }
})
