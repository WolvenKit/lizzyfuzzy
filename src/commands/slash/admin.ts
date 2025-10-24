import {
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js'
import type { TextChannel } from 'discord.js'
import { command, errorLog, db } from 'utils'

const meta = new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin Commands')
    .addSubcommandGroup((group) =>
        group
            .setName('quotes')
            .setDescription('Quote related admin commands')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('block')
                    .setDescription('Block a channel from being quoted')
                    .addChannelOption((option) =>
                        option
                            .setName('channel')
                            .setDescription('The channel to block')
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('unblock')
                    .setDescription('Unblock a channel from being quoted')
                    .addChannelOption((option) =>
                        option
                            .setName('channel')
                            .setDescription('The channel to unblock')
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('list')
                    .setDescription('List all blocked quote channels')
            )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

export default command(meta, async ({ interaction }) => {
    if (
        !interaction.isChatInputCommand() ||
        interaction.user.bot ||
        !interaction.guild ||
        interaction.member?.user.id !== '220278978898821121'
    )
        return

    try {
        const subcommandGroup = interaction.options.getSubcommandGroup()
        const subcommand = interaction.options.getSubcommand()

        if (subcommandGroup === 'quotes') {
            if (subcommand === 'block') {
                const channel = interaction.options.getChannel(
                    'channel'
                ) as TextChannel

                // Insert into database
                await db`INSERT INTO quotesblock (channelname, channelid) VALUES (${channel.name}, ${channel.id});`

                return interaction.reply({
                    content: `Channel __**${channel.name}**__ has been blocked from being quoted.`,
                    flags: MessageFlags.Ephemeral,
                })
            } else if (subcommand === 'unblock') {
                const channel = interaction.options.getChannel(
                    'channel'
                ) as TextChannel

                // Delete from database
                await db`DELETE FROM quotesblock WHERE channelid = ${channel.id};`

                console.log(1)
                return interaction.reply({
                    content: `Channel __**${channel.name}**__ has been unblocked from being quoted.`,
                    flags: MessageFlags.Ephemeral,
                })
            } else if (subcommand === 'list') {
                const blockedChannels = await db`SELECT * FROM quotesblock;`

                if (blockedChannels.length === 0) {
                    return interaction.reply({
                        content:
                            'No channels are currently blocked from being quoted.',
                        flags: MessageFlags.Ephemeral,
                    })
                }

                const channelList = blockedChannels
                    .map(
                        (channel: { channelname: any; channelid: any }) =>
                            `• ${channel.channelname} (ID: ${channel.channelid})`
                    )
                    .join('\n')

                return interaction.reply({
                    content: `Blocked Quote Channels:\n${channelList}`,
                    flags: MessageFlags.Ephemeral,
                })
            }
        }
    } catch (error) {
        errorLog('[Admin Command Error]', error)
        return interaction.reply({
            content: 'An error occurred while executing the command.',
            ephemeral: true,
            flags: MessageFlags.Ephemeral,
        })
    }
})
