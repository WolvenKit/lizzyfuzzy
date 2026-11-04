import { errorLog, event } from 'utils'
import { db } from 'src/index'
import type { OmitPartialGroupDMChannel, Message, Guild, DMChannel, TextChannel } from 'discord.js'
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MessageFlags,
    TextDisplayBuilder,
    MessageActionRowComponentBuilder,
    Attachment,
} from 'discord.js'
import type Database from 'bun:sqlite'
import type { Channel } from 'src/types/database'

async function InitiateSupport(Interaction: OmitPartialGroupDMChannel<Message<boolean>>, db: Database, guild: Guild, dmchannel: DMChannel) {
    const container = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                'Hello there! It looks like you are trying to open a new ticket. If this was your intention click the button below. If not just ignore me!\n\nIf you are trying to open a ticket, please remember all messages send before a ticket has been opened and confirmed by the bot, has not been send.'
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

    await dmchannel.send({
        components: [container],
        flags: MessageFlags.IsComponentsV2,
    })
}

export default event('messageCreate', async ({ client }, Interaction) => {
    try {
        if (Interaction.author.bot) return
        if (!Interaction.channel.isDMBased()) return

        const discordid = Interaction.author.id
        const channel = db.query(`SELECT * FROM channels WHERE discordid = ${discordid} AND active = 1`).get() as Channel | null

        if (channel == null) {
            const guildById = await client.guilds.fetch(process.env.SUPPORT_GUILD)
            const DMChannel = await Interaction.author.createDM()
            InitiateSupport(Interaction, db, guildById, DMChannel)
        } else {
            if (channel.active == 0) return

            const guildById = await client.guilds.fetch(process.env.SUPPORT_GUILD)
            const guildChannel = guildById.channels.cache.get(channel!.channelid) as TextChannel

            if (Interaction.content) {
                guildChannel.send({
                    content: `**${Interaction.author.displayName}**: ${Interaction.content}`,
                })
            }
            if (!Interaction.content && Interaction.attachments) {
                guildChannel.send({
                    files: [...Interaction.attachments.values()],
                })
            }
        }
    } catch (e) {
        errorLog(e)
    }
})
