import {
    PermissionFlagsBits,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    MessageActionRowComponentBuilder,
    TextChannel,
    MessageFlags,
} from 'discord.js'
import { command } from 'utils'

const meta = new SlashCommandBuilder().setName('initiate').setDescription('initiate').setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

export default command(meta, async ({ interaction }) => {
    try {
        if (!interaction.isChatInputCommand() || interaction.user.bot || !interaction.guild) return
        if (!interaction.channel?.isTextBased) return

        const container = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('## Click the Buttons below to give yourself moderator or take the role away.')
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addActionRowComponents(
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel('Add moderator role').setCustomId('add_moderator'),
                    new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel('Remove moderator role').setCustomId('remove_moderator')
                )
            )

        const channel = interaction.channel as TextChannel

        channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        })

        interaction.reply({
            content: 'Send!',
            flags: MessageFlags.Ephemeral,
        })
    } catch (e) {
        console.log(e)
    }
})
