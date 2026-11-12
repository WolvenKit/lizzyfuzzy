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

interface User {
    username: string
    level: number
    experience: number
}

async function getUserData(guild: Guild, leaderboardData: Experience[], interaction: ChatInputCommandInteraction) {
    return Promise.all(
        leaderboardData.map(async (User) => {
            if (!interaction.guild) return

            const user = await guild.members.fetch(User.discordid)
            if (!user) return

            const userData = {
                username: user.displayName,
                level: User.level,
                experience: User.experience,
            }

            if (!userData) return

            return userData
        })
    )
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
        const guild = await interaction.guild.fetch()

        const discordUserData = await getUserData(guild, leaderboardData, interaction)
        if (!discordUserData) return

        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent('## **Leveling Leaderboard**'))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    [
                        `🥇 ${discordUserData[0] ? discordUserData[0]?.username + ' | Level ' + discordUserData[0]?.level : 'Unassigned '}`,
                        `🥈 ${discordUserData[1] ? discordUserData[1]?.username + ' | Level ' + discordUserData[1]?.level : 'Unassigned '}`,
                        `🥉 ${discordUserData[2] ? discordUserData[2]?.username + ' | Level ' + discordUserData[2]?.level : 'Unassigned '}`,
                        ` **__04__** ${discordUserData[3] ? discordUserData[3]?.username + ' | Level ' + discordUserData[3]?.level : 'Unassigned '}`,
                        ` **__05__** ${discordUserData[4] ? discordUserData[4]?.username + ' | Level ' + discordUserData[4]?.level : 'Unassigned '}`,
                        ` **__06__** ${discordUserData[5] ? discordUserData[5]?.username + ' | Level ' + discordUserData[5]?.level : 'Unassigned '}`,
                        ` **__07__** ${discordUserData[6] ? discordUserData[6]?.username + ' | Level ' + discordUserData[6]?.level : 'Unassigned '}`,
                        ` **__08__** ${discordUserData[7] ? discordUserData[7]?.username + ' | Level ' + discordUserData[7]?.level : 'Unassigned '}`,
                        ` **__09__** ${discordUserData[8] ? discordUserData[8]?.username + ' | Level ' + discordUserData[8]?.level : 'Unassigned '}`,
                        ` **__10__** ${discordUserData[9] ? discordUserData[9]?.username + ' | Level ' + discordUserData[9]?.level : 'Unassigned '}`,
                    ].join('\n')
                )
            )

        await interaction.reply({
            components: [container],
            flags: 'IsComponentsV2',
        })
    } catch (e) {
        console.log(e)
    }
})
