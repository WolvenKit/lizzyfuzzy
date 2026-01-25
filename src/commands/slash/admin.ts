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
    .addSubcommandGroup((group) =>
        group
            .setName('db')
            .setDescription('Database related admin commands')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('quote-list')
                    .setDescription('List all quotes in the database')
            )
            .addSubcommand((subcommand) =>
                subcommand.setName('link-data').setDescription('Link data')
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('link-data-user')
                    .setDescription('Link data User')
                    .addStringOption((option) =>
                        option
                            .setName('userid')
                            .setDescription('The Discord User ID')
                            .setRequired(true)
                    )
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
        } else if (subcommandGroup === 'db') {
            if (subcommand === 'quote-list') {
                const quotes = await db`SELECT * FROM quotes;`

                if (quotes.length === 0) {
                    return interaction.reply({
                        content: 'No quotes found in the database.',
                        flags: MessageFlags.Ephemeral,
                    })
                }

                return interaction.reply({
                    content: `Quotes ammount in DB: ${quotes.length}`,
                    flags: MessageFlags.Ephemeral,
                })
            } else if (subcommand === 'link-data') {
                const users = await db`SELECT * FROM users;`

                if (users.length === 0) {
                    return interaction.reply({
                        content: 'No linked users found in the database.',
                        flags: MessageFlags.Ephemeral,
                    })
                }

                // Username and Discord ID list
                const userList = users
                    .map(
                        (user: { username: any; discordid: any }) =>
                            `• ${user.username} (Discord ID: ${user.discordid})`
                    )
                    .join('\n')

                // if 2000 characters exceeded, truncate
                if (userList.length > 2000) {
                    return interaction.reply({
                        content:
                            'The list of linked users is too long to display.',
                        flags: MessageFlags.Ephemeral,
                    })
                }

                return interaction.reply({
                    content: `Linked Users:\n${userList}`,
                    flags: MessageFlags.Ephemeral,
                })
            } else if (subcommand === 'link-data-user') {
                const userId = interaction.options.getString('userid')

                const user =
                    await db`SELECT * FROM users WHERE discordid = ${userId};`

                if (user.length === 0) {
                    return interaction.reply({
                        content: `No linked user found with Discord ID: ${userId}.`,
                        flags: MessageFlags.Ephemeral,
                    })
                }

                return interaction.reply({
                    content: `User Data for Discord ID ${userId}:\nUsername: ${user[0].username}\nGitHub: ${user[0].githubusername}\nNexus Mods: ${user[0].nexusmodsusername}`,
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
