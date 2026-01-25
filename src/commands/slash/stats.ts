import { MessageFlags, SlashCommandBuilder } from 'discord.js'
import { command, db } from 'utils'

const meta = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('toggle statisitic collection')

export default command(meta, async ({ interaction }) => {
    if (
        !interaction.isChatInputCommand() ||
        !interaction.guild ||
        interaction.user.bot
    )
        return

    const result =
        await db`SELECT * FROM wrappedwhitelist WHERE discordid = ${interaction.user.id};`

    if (result.length > 0) {
        await db`DELETE FROM wrappedwhitelist WHERE discordid = ${interaction.user.id};`
        return interaction.reply({
            content: 'You have been removed from the wrapped whitelist.',
            flags: MessageFlags.Ephemeral,
        })
    } else {
        await db`INSERT INTO wrappedwhitelist (discordid, wrapped) VALUES (${
            interaction.user.id
        }, ${true});`
        return interaction.reply({
            content: 'You have been added to the wrapped whitelist.',
            flags: MessageFlags.Ephemeral,
        })
    }
})
