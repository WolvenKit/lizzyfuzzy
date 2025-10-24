import { event } from 'utils'

export default event('interactionCreate', async ({ client }, interaction) => {
    if (interaction.isAutocomplete()) {
        const focusedOption = interaction.options.getFocused(true)
        const choices = ['choice1', 'choice2', 'choice3']
        const filtered = choices.filter((choice) =>
            choice.startsWith(focusedOption.value)
        )
        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice }))
        )
    }
})
