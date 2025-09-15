import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import type { TextChannel } from 'discord.js'
import { command, errorLog, localBD, log } from 'utils'

const meta = new SlashCommandBuilder()
    .setName('quote')
    .setDescription('quotes')
    .addNumberOption((option) => option.setName('quote').setDescription('Fetch a Quote by its Global ID').setRequired(false).setMinValue(1))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

interface quote {
    id: number
    quote: string
    responde: string
    server: string
}

export default command(meta, async ({ interaction }) => {
    try {
        const quoteId = interaction.options.getNumber('quote')
        if (!quoteId) {
            const quotes = await localBD
                .query(
                    `SELECT *
        FROM quotes
        WHERE (
            responde = ${interaction.user.id} AND server = ${interaction.guildId}
        ) OR (
            responde = ${interaction.guild?.roles.everyone.id} AND server = ${interaction.guildId}
        )
        ORDER BY RANDOM()
        LIMIT 1;`
                )
                .get()

            if (!quotes) {
                return await interaction.reply({
                    content: 'No Quotes found.',
                    flags: MessageFlags.Ephemeral,
                })
            }
            if (interaction.guildId !== quotes.server) return

            return await interaction.reply({
                content: quotes.quote,
            })
        }

        const quotes = await localBD
            .query(
                `SELECT *
      FROM quotes
      WHERE id = ${quoteId}
        AND server = ${interaction.guildId}
      LIMIT 1;`
            )
            .get()

        if (!quotes) {
            return await interaction.reply({
                content: 'Quote not found.',
                flags: MessageFlags.Ephemeral,
            })
        }

        if (interaction.guildId !== quotes.server) return

        switch (quotes.responde) {
            case interaction.guild?.roles.everyone.id:
                return interaction.reply({
                    content: quotes.quote,
                })
            case interaction.user.id:
                return interaction.reply({
                    content: quotes.quote,
                })
            default:
                return interaction.reply({
                    content: 'Unauthorized to use this Quote. Search for another one.',
                    flags: MessageFlags.Ephemeral,
                })
        }
    } catch (error) {
        await errorLog(error)
        return await interaction.reply({
            content: 'An Error Occured.',
            flags: MessageFlags.Ephemeral,
        })
    }
})
