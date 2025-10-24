import { ContextMenuCommandBuilder, EmbedBuilder, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { command } from 'utils'

const meta = new ContextMenuCommandBuilder().setName('User Info').setType(2) // 2 is for user context menu

export default command(meta, async ({ interaction }) => {
    if (!interaction.isUserContextMenuCommand() || interaction.user.bot || !interaction.guild) return

    const member = await interaction.guild.members.fetch(interaction.targetId)
    if (!member) return interaction.reply('Member not found')

    const embed = new EmbedBuilder()
        .setTitle(`User Info - ${member.user.tag}`)
        .setThumbnail(member.user.displayAvatarURL())
        .addFields(
            { name: 'User ID', value: member.id, inline: true },
            {
                name: 'Nickname',
                value: member.nickname || 'None',
                inline: true,
            },
            {
                name: 'Joined Server',
                value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:F>`,
                inline: false,
            },
            {
                name: 'Account Created',
                value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`,
                inline: false,
            },
            {
                name: 'Roles',
                value: member.roles.cache.map((role) => role.name).join(', ') || 'None',
                inline: false,
            }
        )
        .setColor(0x00ae86)
        .setTimestamp()

    return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
})
