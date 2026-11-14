import { errorLog, event, log } from 'utils'
import { db } from 'src/index'

export default event('interactionCreate', async ({}, Interaction) => {
    try {
        if (Interaction.user.bot) return
        if (!Interaction.isButton()) return
        if (Interaction.customId != 'transfer_ownership') return
    } catch (error) {
        errorLog('[Event Error]', error)
    }
})
