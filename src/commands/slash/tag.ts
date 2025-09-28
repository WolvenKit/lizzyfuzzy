import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import type { TextChannel } from 'discord.js'
import { command } from 'utils'

const meta = new SlashCommandBuilder()
    .setName('tag')
    .setDescription('Tag Commands')
    .addStringOption((string) =>
        string
            .setName('command')
            .setDescription('The Command')
            .setRequired(true)
            .setAutocomplete(true)
    )

export default command(meta, async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return
    if (!interaction.guild) return
    if (interaction.user.bot) return
    // SEE TAG EVENT HANDLER
})
