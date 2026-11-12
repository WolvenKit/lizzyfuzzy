import {
    ContainerBuilder,
    MessageFlags,
    SeparatorBuilder,
    SeparatorSpacingSize,
    TextDisplayBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    Guild,
    ChatInputApplicationCommandData,
    ChatInputCommandInteraction,
} from 'discord.js'
import { command } from 'utils'
import { LeaderboardQuerry } from 'src/scripts/interactionQuerries'
import { Experience } from 'src/types/database'

async function getUserData(leaderboardData: Experience[], interaction: ChatInputCommandInteraction) {
    leaderboardData.map((User) => {
        if (!interaction.guild) return

        const userData = {
            username: User.discordid,
            level: User.level,
            experience: User.experience,
        }

        if (!userData) return

        return userData
    })
}
const meta = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Leaderboard for the internal leveling System.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

export default command(meta, async ({ interaction }) => {
    try {
        if (!interaction.isChatInputCommand() || interaction.user.bot || !interaction.guild) return
        if (!interaction.channel?.isTextBased) return

        if (!interaction.guildId) return

        const leaderboardData = LeaderboardQuerry(interaction.guildId)

        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent('## **Leveling Leaderboard**'))
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

        await interaction.reply({
            components: [container],
            flags: ['IsComponentsV2', 'SuppressNotifications'],
            allowedMentions: {
                users: [],
            },
        })
    } catch (e) {
        console.log(e)
    }
})
