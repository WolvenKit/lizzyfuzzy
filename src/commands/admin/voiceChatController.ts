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
import { registerVoiceChatController } from 'src/scripts/interactionQuerries'

const meta = new SlashCommandBuilder()
    .setName('vccontroller')
    .setDescription('Initiate Voice Chat Controller')
    .addRoleOption((role) => role.setName('moderator').setDescription('Moderator role').setRequired(true))
    .addRoleOption((role) => role.setName('minrole').setDescription('Minimum role to create a channel').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

export default command(meta, async ({ interaction }) => {
    try {
        if (!interaction.isChatInputCommand() || interaction.user.bot || !interaction.guild) return
        if (!interaction.channel?.isTextBased) return
        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(['## 💬 **Voice Channel Control Pannel**', ''].join('\n')))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    [
                        '##  ❓General questions❓',
                        '### - **How do I create a new voice Channel?**',
                        'For creating a new voice channel click the buttons below.',
                        '### - **How do I remove the Channel?**',
                        'Removing or deleting a voice channel is automatic.',
                        'After all users leave the voice channel, it is automatically deleted.',
                        '### - **How do I rename the Channel?**',
                        'For now renaming channels is limited to having reached the ${role} role.',
                        '### - **Can I lock a Channel?**',
                        "Yes! It's quite easy to lock a channel. Press the button __Toggle Lock__ below and the channel is locked. Every member already in the channel is added to the channel and can leave and rejoin. If you need to add a new member to a locked channel, use the __Add User to Channel__ button.",
                        '### - **How does Ownership works?**',
                        'The person who created the channel gets the ownership. The owner of a channel can change the ownership to anyone they like by clicking the __Transfer Ownership__ button.  ',
                        '',
                        'More Questions? Ask around. Someone will have a answer.',
                    ].join('\n')
                )
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addActionRowComponents(
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel('Create Channel').setCustomId('create_channel'),
                    new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel('Transfer Ownership').setCustomId('transfer_ownership'),
                    new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel('Toggle Lock').setCustomId('toggle_lock'),
                    new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel('Add User to Channel').setCustomId('add_channel_user')
                )
            )

        const channel = interaction.channel as TextChannel

        const message = await channel.send({
            components: [container],
            flags: MessageFlags.IsComponentsV2,
        })

        const minrole = interaction.options.getRole('minrole', false)?.id || null
        const moderatorrole = interaction.options.getRole('moderator', true).id
        const categoryid = message.channel.parentId

        if (!categoryid) return Error

        console.log(message.guildId, message.id, minrole, moderatorrole, categoryid)

        registerVoiceChatController(message.guildId, message.id, minrole, moderatorrole, categoryid)

        interaction.reply({
            content: 'Send!',
            flags: MessageFlags.Ephemeral,
        })
    } catch (e) {
        console.log(e)
    }
})
