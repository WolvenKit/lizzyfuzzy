import {
    ContainerBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    SlashCommandBuilder,
    ThumbnailBuilder,
    SectionBuilder,
} from 'discord.js'
import { command } from 'utils'
import { LeaderboardQuerry, personalLeaderboard } from 'src/scripts/interactionQuerries'

const meta = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Leaderboard for the internal leveling System.')
    .addBooleanOption((i) => i.setName('me').setDescription('Find out your data.'))
    .addBooleanOption((i) => i.setName('show').setDescription('Show the message everyone.'))

export default command(meta, async ({ interaction }) => {
    try {
        if (!interaction.isChatInputCommand() || interaction.user.bot || !interaction.guild) return
        if (!interaction.channel?.isTextBased) return

        if (!interaction.guildId) return

        const personaised = interaction.options.getBoolean('me', false) || false
        const show = interaction.options.getBoolean('show', false) || false

        if (personaised) {
            const meData = personalLeaderboard(interaction.guildId, interaction.user.id)

            const container = new ContainerBuilder().addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            [
                                `## **Hello <@${meData.discordid}>**`,
                                '',
                                `You are currently level: ${meData.level}`,
                                '---------------------------------',
                                `- Total messages written: ${meData.messagecount}`,
                                `- Total experience gathers: ${meData.experience}`,
                            ].join('\n')
                        )
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder().setURL(
                            interaction.user.avatarURL() || 'https://dweeb.faizo.net/media/defaults/dweeb-default-thumbnail.jpg'
                        )
                    )
            )
            if (show) {
                return await interaction.reply({
                    components: [container],
                    flags: ['IsComponentsV2', 'SuppressNotifications'],
                    allowedMentions: {
                        users: [],
                    },
                })
            }

            return await interaction.reply({
                components: [container],
                flags: ['IsComponentsV2', 'SuppressNotifications', 'Ephemeral'],
                allowedMentions: {
                    users: [],
                },
            })
        }

        const leaderboardData = LeaderboardQuerry(interaction.guildId)

        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent('## **Leveling  Leaderboard**'))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    [
                        `🥇 ${leaderboardData[0] ? `<@` + leaderboardData[0]?.discordid + `>` + ' | Level ' + leaderboardData[0]?.level : 'Unassigned '}`,
                        `🥈 ${leaderboardData[1] ? `<@` + leaderboardData[1]?.discordid + `>` + ' | Level ' + leaderboardData[1]?.level : 'Unassigned '}`,
                        `🥉 ${leaderboardData[2] ? `<@` + leaderboardData[2]?.discordid + `>` + ' | Level ' + leaderboardData[2]?.level : 'Unassigned '}`,
                        ` **__04__** ${leaderboardData[3] ? `<@` + leaderboardData[3]?.discordid + `>` + ' | Level ' + leaderboardData[3]?.level : 'Unassigned '}`,
                        ` **__05__** ${leaderboardData[4] ? `<@` + leaderboardData[4]?.discordid + `>` + ' | Level ' + leaderboardData[4]?.level : 'Unassigned '}`,
                        ` **__06__** ${leaderboardData[5] ? `<@` + leaderboardData[5]?.discordid + `>` + ' | Level ' + leaderboardData[5]?.level : 'Unassigned '}`,
                        ` **__07__** ${leaderboardData[6] ? `<@` + leaderboardData[6]?.discordid + `>` + ' | Level ' + leaderboardData[6]?.level : 'Unassigned '}`,
                        ` **__08__** ${leaderboardData[7] ? `<@` + leaderboardData[7]?.discordid + `>` + ' | Level ' + leaderboardData[7]?.level : 'Unassigned '}`,
                        ` **__09__** ${leaderboardData[8] ? `<@` + leaderboardData[8]?.discordid + `>` + ' | Level ' + leaderboardData[8]?.level : 'Unassigned '}`,
                        ` **__10__** ${leaderboardData[9] ? `<@` + leaderboardData[9]?.discordid + `>` + ' | Level ' + leaderboardData[9]?.level : 'Unassigned '}`,
                    ].join('\n')
                )
            )

        if (show) {
            return await interaction.reply({
                components: [container],
                flags: ['IsComponentsV2', 'SuppressNotifications'],
                allowedMentions: {
                    users: [],
                },
            })
        }

        return await interaction.reply({
            components: [container],
            flags: ['IsComponentsV2', 'SuppressNotifications', 'Ephemeral'],
            allowedMentions: {
                users: [],
            },
        })
    } catch (e) {
        console.log(e)
    }
})
