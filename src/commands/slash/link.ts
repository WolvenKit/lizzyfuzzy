import {
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js'
import type { GuildMemberRoleManager } from 'discord.js'
import { GithubQuery } from 'src/utils/github'
import { command, NexusQuery, db } from 'utils'

const meta = new SlashCommandBuilder()
    .setName('link')
    .setDescription('Linking information to the website. V2')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) =>
        option
            .setName('nexusmods')
            .setDescription('NexusMods Username')
            .setMaxLength(20)
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('github')
            .setDescription('GitHub Username')
            .setMaxLength(20)
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('theme')
            .setDescription('Choose you profile theme')
            .addChoices(
                { name: 'Default', value: 'default' },
                { name: 'Cyberpunk', value: 'cyberpunk' },
                { name: 'Witcher', value: 'witcher' }
            )
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('description')
            .setDescription('Short description about yourself')
            .setMaxLength(2012)
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('username')
            .addChoices(
                { name: 'Uppercase', value: 'uppercase' },
                { name: 'Lowercase', value: 'lowercase' }
            )
            .setDescription('Choose your username style')
            .setRequired(true)
    )

export default command(meta, async ({ interaction }) => {
    if (
        !interaction.isChatInputCommand() ||
        interaction.user.bot ||
        !interaction.guild
    )
        return

    interaction
        .deferReply({
            flags: MessageFlags.Ephemeral,
        })
        .then(async () => {
            const Roles = interaction.member
                ? (
                      interaction.member.roles as GuildMemberRoleManager
                  ).cache.map((role) => {
                      return {
                          id: role.id,
                          name: role.name,
                          position: role.position,
                          rawPosition: role.rawPosition,
                          icon: role.icon,
                          iconUrl: role.iconURL(),
                      }
                  })
                : []

            await db`
INSERT INTO users (
    username,
    globalname,
    avatar,
    discordid,
    theme,
    style,
    description,
    githubusername,
    nexusmodsusername,
    nexusmods,
    github,
    roles
) VALUES (
    ${interaction.user.username ?? null},
    ${interaction.user.username ?? null},
    ${interaction.user.displayAvatarURL() ?? null},
    ${interaction.user.id ?? null},
    ${interaction.options.getString('theme') ?? 'default'},
    ${interaction.options.getString('username') ?? 'uppercase'},
    ${interaction.options.getString('description') ?? null},
    ${interaction.options.getString('github') ?? null},
    ${interaction.options.getString('nexusmods') ?? null},
    ${
        (await NexusQuery(interaction.options.getString('nexusmods') || '')) ??
        null
    },
    ${
        (await GithubQuery(interaction.options.getString('github') || '')) ??
        null
    },
    ${Roles ?? null}
) ON CONFLICT (discordid) DO UPDATE SET
    username = IsNull EXCLUDED.username,
    globalname = EXCLUDED.globalname,
    avatar = EXCLUDED.avatar, 
    theme = EXCLUDED.theme,
    style = EXCLUDED.style,
    description = EXCLUDED.description,
    githubusername = EXCLUDED.githubusername,
    nexusmodsusername = EXCLUDED.nexusmodsusername,
    nexusmods = EXCLUDED.nexusmods,
    github = EXCLUDED.github,
    roles = EXCLUDED.roles 
 `.then(async () => {
                return interaction.editReply({
                    embeds: [
                        {
                            title: 'Account Linked',
                            description:
                                'Your account has been successfully linked/Updated.',
                            color: 0x00ff00,
                        },
                    ],
                })
            })
        })
})
