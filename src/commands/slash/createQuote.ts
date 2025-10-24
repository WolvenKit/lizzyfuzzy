import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { command, db, log } from 'utils'

const meta = new SlashCommandBuilder()
    .setName('create-quote')
    .setDescription('Create data for the Database!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) => option.setName('quote').setDescription('The quote itself').setRequired(true))
    .addBooleanOption((option) => option.setName('private').setDescription('Whether the response should be private').setRequired(false))

export default command(meta, async ({ interaction }) => {
    if (!interaction.isChatInputCommand() || interaction.user.bot || !interaction.guild) return

    const quote = interaction.options.getString('quote', true)
    const isPrivate = interaction.options.getBoolean('private', false) || false
    const responde = isPrivate ? interaction.user : null
    const respondeId = responde ? responde.id : 'everyone'

    await db`
        INSERT INTO quotes (quote, responde, server)
        VALUES (${quote}, ${respondeId}, ${interaction.guild.id});
    `
        .then(() => {
            log(`New quote added in server ${interaction.guild?.name} (${interaction.guild?.id}) by ${interaction.user.tag} (${interaction.user.id})`)
            return interaction.reply({
                content: 'Quote added successfully!',
                flags: MessageFlags.Ephemeral,
            })
        })
        .catch((err) => {
            log(
                `Error adding quote in server ${interaction.guild?.name} (${interaction.guild?.id}) by ${interaction.user.tag} (${interaction.user.id}): ${err}`
            )
            return interaction.reply({
                content: 'There was an error adding the quote.',
                flags: MessageFlags.Ephemeral,
            })
        })
})
