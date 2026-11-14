import { errorLog, event, log } from 'utils'
import { db } from 'src/index'
import {
    ChannelType,
    PermissionFlagsBits,
    type Role,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    ThumbnailBuilder,
    MessageActionRowComponentBuilder,
    Interaction,
    Client,
    messageLink,
} from 'discord.js'
import type { Querry } from 'src/types/database'

async function fetchBan(Interaction: Interaction, client: Client) {
    try {
        const primaryGuild = await client.guilds.fetch(process.env.PRIMARY_GUILD)

        const ban = await primaryGuild.bans.fetch(Interaction.user)

        if (ban) return ban
    } catch {
        return null
    }
}

export default event('interactionCreate', async ({ client }, Interaction) => {
    try {
        if (Interaction.user.bot) return
        if (!Interaction.isModalSubmit()) return
        if (Interaction.customId != 'ticket_modal') return

        const discordid = Interaction.user.id
        const guildById = await client.guilds.fetch(process.env.SUPPORT_GUILD)
        const everyoneRole = guildById.roles.everyone
        const moderatorRole = (await guildById.roles.fetch(process.env.SUPPORT_MODERATOR_ROLE)) as Role
        const amount = db.query(`SELECT COUNT(*) FROM channels;`).get() as Querry

        try {
            const channel = await (
                await guildById.channels.create({
                    name: `ticket-${((amount['COUNT(*)'] as number) + 1).toString().padStart(4, '0')}`,
                    type: ChannelType.GuildText,

                    permissionOverwrites: [
                        { id: everyoneRole, deny: PermissionFlagsBits.ViewChannel },
                        { id: moderatorRole, allow: PermissionFlagsBits.ViewChannel },
                    ],
                })
            ).setParent(process.env.OPEN_TICKET_CATEGORY)

            log('New Ticket Created. No ' + ((amount['COUNT(*)'] as number) + 1).toString().padStart(4, '0'))

            const Message = Interaction.fields.getTextInputValue('issue_text')
            const userImage = Interaction.user.avatarURL()

            const getBan = await fetchBan(Interaction, client)

            const ban = getBan != null ? getBan : null

            const container = new ContainerBuilder()
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                [
                                    '# Information',
                                    '__**USER ID**__: `' + discordid + '`',
                                    '__**USERNAME**__: `' + Interaction.user.displayName + '`',
                                    '__**MODERATION ACTION**__:' + ban ? 'Not banned' : 'banned',
                                    '__**REASON**__:' + ban ? 'No reason' : ban!.reason,
                                    '',
                                ].join('\n')
                            )
                        )
                        .setThumbnailAccessory(
                            new ThumbnailBuilder().setURL(
                                Interaction.user.avatarURL() || 'https://dweeb.faizo.net/media/defaults/dweeb-default-thumbnail.jpg'
                            )
                        )
                )
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('### Ticket Content'),
                    new TextDisplayBuilder().setContent(Interaction.fields.getTextInputValue('issue_text'))
                )
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
                .addActionRowComponents(
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                        new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel('Close Ticket').setCustomId('close_ticket_mod'),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel('Remove Ban')
                            .setCustomId('unban_user')
                            .setDisabled(ban ? false : true)
                    )
                )

            const newMessage = await channel.send({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            })

            db.prepare(
                `insert into channels (discordid, channelid, initialmessageUser, ticketmessage, userimage, initialmessageChannel) values (${discordid}, ${channel.id}, ${Interaction.message?.id}, "${Message}", "${userImage}", "${newMessage.id}")`
            ).run()

            await Interaction.deferUpdate()
        } catch (error) {
            errorLog(error)

            await Interaction.reply({
                content: 'Looks like something has gone wrong. Please try again. If this issue persists, feel free to DM <@220278978898821121>',
                flags: MessageFlags.Ephemeral,
            })
        }
    } catch (e) {
        errorLog('modalReact ' + e)
    }
})
