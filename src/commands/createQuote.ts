import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { command, localBD, log } from 'utils'

const meta = new SlashCommandBuilder()
    .setName('create_quote')
    .setDescription('Create data for the Database!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) =>
        option
            .setName('quote')
            .setDescription('The quote itself')
            .setRequired(true)
    )
    .addUserOption((user) =>
        user
            .setName('responder')
            .setDescription('The user to respond to. Default Everyone')
            .setRequired(false)
    )

export default command(meta, async ({ interaction }) => {
    if (!interaction.isChatInputCommand()) return
    if (!interaction.guild) return
    if (interaction.user.bot) return

    try {
        const Quote = interaction.options.getString('quote', true)
        const Responder = interaction.options.getUser('responder', false)

        const query = localBD.prepare(
            'INSERT INTO quotes (quote, responde, server) VALUES (?, ?, ?)'
        )

        const result = query.run(
            Quote,
            Responder?.id || interaction.guild.roles.everyone.id,
            interaction.guildId
        )

        if (!result) {
            return interaction.reply({
                content: 'Failed to create quote',
                flags: 64,
            })
        }

        log(
            `[INFO] ${interaction.member?.user.username} created quote ${result.lastInsertRowid} successfully`
        )
        return await interaction.reply({
            content: `Quote created! with ID: ${result.lastInsertRowid}`,
            flags: 64,
        })
    } catch (error) {
        console.error(error)
        return interaction.reply({
            content: 'An error occurred while creating the quote',
            flags: 64,
        })
    }
})
