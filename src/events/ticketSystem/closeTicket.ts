import { errorLog, event } from 'utils'
import { db } from 'src/index'
import {
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
    TextChannel,
    Interaction,
    Client,
} from 'discord.js'

import type { Channel } from 'src/types/database'

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
        if (!Interaction.isButton()) return

        const getBan = await fetchBan(Interaction, client)
        const ban = getBan != null ? getBan : null

        if (Interaction.customId == 'close_ticket_DM') {
            const userid = Interaction.user.id
            const userTicket = db.query(`SELECT * FROM channels WHERE discordid = ${userid} and active = 1`).get() as Channel

            if (!userTicket) {
                const container = new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            'Thank you for creating the Ticket. This ticket has been closed now. If you want to open a new one just click Open Ticket or write a new message in the chat.\n\n- REDmodding Moderator Team'
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<MessageActionRowComponentBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Success)
                                    .setDisabled(false)
                                    .setLabel('Open Ticket')
                                    .setEmoji({ id: '1281304248168218724', name: 'cat_hi_animated' })
                                    .setCustomId('start_ticket')
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Danger)
                                    .setDisabled(true)
                                    .setLabel('Close Ticket')
                                    .setEmoji({ id: '1307014888098500669', name: 'peepoBye' })
                                    .setCustomId('close_ticket_DM')
                            )
                    )

                await Interaction.update({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2,
                })
            }

            const DMChannel = await Interaction.user.createDM()

            DMChannel.send({
                content: 'The User has closed the ticket.',
            })

            const guild = await client.guilds.fetch(process.env.SUPPORT_GUILD)
            const channel = (await guild.channels.fetch(userTicket.channelid)) as TextChannel

            const firstMessage = await channel.messages.fetch(userTicket.initialmessageChannel)

            const container = new ContainerBuilder()
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                [
                                    '# Information',
                                    '__**USER ID**__: `' + userid + '`',
                                    '__**USERNAME**__: `' + Interaction.user.displayName + '`',
                                    '__**MODERATION ACTION**__:' + ban ? 'Not banned' : 'banned',
                                    '__**REASON**__:' + ban ? 'No reason' : ban!.reason,
                                    '',
                                ].join('\n')
                            )
                        )
                        .setThumbnailAccessory(
                            new ThumbnailBuilder().setURL(
                                userTicket.userimage || 'https://dweeb.faizo.net/media/defaults/dweeb-default-thumbnail.jpg'
                            )
                        )
                )
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('### Ticket Content'),
                    new TextDisplayBuilder().setContent(userTicket.ticketmessage)
                )
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
                .addActionRowComponents(
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                        new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel('Close Ticket').setCustomId('close_ticket_mod').setDisabled(true),
                        new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel('Remove Ban').setCustomId('unban_user').setDisabled(true)
                    )
                )

            await firstMessage.edit({
                components: [container],
                flags: 'IsComponentsV2',
            })

            channel.send({
                content: 'The ticket has been close by the User.',
            })

            channel.lockPermissions()
            channel.setParent(process.env.CLOSED_TICKET_CATEGORY)

            db.prepare(`UPDATE channels SET active = 0 WHERE active = 1 AND discordid = ${userid}`).run()

            const userContainer = new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(
                        'Thank you for creating the Ticket. This ticket has been closed now. If you want to open a new one just click start_ticket or write a new message in the chat.\n\n- REDmodding Moderator Team'
                    )
                )
                .addActionRowComponents(
                    new ActionRowBuilder<MessageActionRowComponentBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(false)
                                .setLabel('Open Ticket')
                                .setEmoji({ id: '1281304248168218724', name: 'cat_hi_animated' })
                                .setCustomId('start_ticket')
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                                .setLabel('Close Ticket')
                                .setEmoji({ id: '1307014888098500669', name: 'peepoBye' })
                                .setCustomId('close_ticket_DM')
                        )
                )

            await Interaction.update({
                components: [userContainer],
                flags: MessageFlags.IsComponentsV2,
            })
        }

        //
        // MODERATOR CLOSE TICKET
        //

        if (Interaction.customId == 'close_ticket_mod') {
            const userid = Interaction.user.id

            const channelTicket = db.query(`select * from channels where channelid = ${Interaction.channelId}`).get() as Channel

            try {
                const user = await client.users.fetch(channelTicket.discordid)
                const dmMessage = await user.dmChannel?.messages.fetch(channelTicket.initialmessageUser)

                const dmContainer = new ContainerBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            'Thank you for creating the Ticket. This ticket has been closed now. If you want to open a new one just click Open Ticket or write a new message in the chat.\n\n- REDmodding Moderator Team'
                        )
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder<MessageActionRowComponentBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Success)
                                    .setDisabled(false)
                                    .setLabel('Open Ticket')
                                    .setEmoji({ id: '1281304248168218724', name: 'cat_hi_animated' })
                                    .setCustomId('start_ticket')
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Danger)
                                    .setDisabled(true)
                                    .setLabel('Close Ticket')
                                    .setEmoji({ id: '1307014888098500669', name: 'peepoBye' })
                                    .setCustomId('close_ticket_DM')
                            )
                    )

                if (!dmMessage) {
                    const dmChannel = await user.createDM()

                    const message = await dmChannel.messages.fetch(channelTicket.initialmessageUser)

                    await message.edit({
                        components: [dmContainer],
                        flags: MessageFlags.IsComponentsV2,
                    })
                }

                await dmMessage?.edit({
                    components: [dmContainer],
                    flags: MessageFlags.IsComponentsV2,
                })
            } catch (e) {
                errorLog(e)
            }

            const DMChannel = await Interaction.user.createDM()
            DMChannel.send({
                content: 'A moderator has closed the ticket.',
            })

            db.prepare(`UPDATE channels SET active = 0 WHERE active = 1 AND discordid = ${userid}`).run()

            const container = new ContainerBuilder()
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                [
                                    '# Information',
                                    '__**USER ID**__: `' + userid + '`',
                                    '__**USERNAME**__: `' + Interaction.user.displayName + '`',
                                    '__**MODERATION ACTION**__:' + ban ? 'Not banned' : 'banned',
                                    '__**REASON**__:' + ban ? 'No reason' : ban!.reason,
                                    '',
                                ].join('\n')
                            )
                        )
                        .setThumbnailAccessory(
                            new ThumbnailBuilder().setURL(
                                channelTicket.userimage || 'https://dweeb.faizo.net/media/defaults/dweeb-default-thumbnail.jpg'
                            )
                        )
                )
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('### Ticket Content'),
                    new TextDisplayBuilder().setContent(channelTicket.ticketmessage)
                )
                .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
                .addActionRowComponents(
                    new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                        new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel('Close Ticket').setCustomId('close_ticket_mod').setDisabled(true),
                        new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel('Remove Ban').setCustomId('unban_user').setDisabled(true)
                    )
                )

            await Interaction.update({
                components: [container],
                flags: MessageFlags.IsComponentsV2,
            })

            const channel = Interaction.channel as TextChannel

            channel.send({
                content: 'The ticket has been closed by a Moderator.',
            })

            channel.lockPermissions()
            channel.setParent(process.env.CLOSED_TICKET_CATEGORY)
        }
    } catch (e) {
        errorLog('closeTicket ' + e)
    }
})
