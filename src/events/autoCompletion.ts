import { MessageFlags } from 'discord.js'
import { errorLog, event, commandDB } from 'utils'

interface command {
    id: number
    isEmbed: boolean
    name: string
    content: string
}

export default event('interactionCreate', async ({ client }, interaction) => {
    if (interaction.isAutocomplete()) {
        if (interaction.commandName !== 'tag') return

        const focusedValue = interaction.options.getFocused()

        const choices = Object.values(commandDB.query('SELECT name FROM commands').get())

        const filtered = choices.filter((choice) => choice.startsWith(focusedValue))
        await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })))
    }

    if (interaction.isChatInputCommand()) {
        if (interaction.commandName !== 'tag') return
        if (!interaction.channel?.isTextBased()) return

        const int = interaction.options.getString('command', true)
        const command = commandDB.query(`SELECT * FROM commands WHERE name = "${int}"`).get() as command

        const content = JSON.parse(command.content)
        if (command.isEmbed) {
            interaction.reply({
                components: content,
                flags: MessageFlags.IsComponentsV2,
            })
        } else {
            interaction.reply({
                content: command.content,
            })
        }
    }
})
