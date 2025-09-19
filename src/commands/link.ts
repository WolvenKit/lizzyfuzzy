import {
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from 'discord.js'
import type { GuildMemberRoleManager } from 'discord.js'
import { GithubQuery } from 'src/utils/github'
import { command, userDB, NexusQuery } from 'utils'

const meta = new SlashCommandBuilder()
    .setName('link')
    .setDescription('Linking information to the website. V2')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) =>
        option
            .setName('nexusmods')
            .setDescription('NexusMods Username')
            .setMaxLength(20)
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName('github')
            .setDescription('GitHub Username')
            .setMaxLength(20)
            .setRequired(false)
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
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName('description')
            .setDescription('Short description about yourself')
            .setMaxLength(2012)
            .setRequired(false)
    )
    .addStringOption((option) =>
        option
            .setName('username')
            .addChoices(
                { name: 'Uppercase', value: 'uppercase' },
                { name: 'Lowercase', value: 'lowercase' }
            )
            .setDescription('Choose your username style')
            .setRequired(false)
    )

export default command(meta, async ({ interaction }) => {
    if (!interaction.isCommand()) return

    interaction.deferReply({
        flags: MessageFlags.Ephemeral,
    })

    const nexusmods =
        JSON.stringify(
            await NexusQuery(interaction.options.getString('nexusmods') || '')
        ) || {}

    const github =
        JSON.stringify(
            await GithubQuery(interaction.options.getString('github') || '')
        ) || {}

    const Roles = interaction.member
        ? (interaction.member.roles as GuildMemberRoleManager).cache.map(
              (role) => {
                  return {
                      id: role.id,
                      name: role.name,
                      position: role.position,
                      rawPosition: role.rawPosition,
                      icon: role.icon,
                      iconUrl: role.iconURL(),
                  }
              }
          )
        : []

    const object = {
        id: interaction.user.id,
        username: interaction.user.username ?? null,
        globalname: interaction.user.globalName ?? null,
        avatar: interaction.user.displayAvatarURL(),
        discordid: interaction.user.id,
        nexusmodsusername: interaction.options.getString('nexusmods') ?? null,
        githubusername: interaction.options.getString('github') ?? null,
        theme: interaction.options.getString('theme') ?? null,
        description: interaction.options.getString('description') ?? null,
        style: interaction.options.getString('username') ?? null,
        github: github,
        nexusmods: nexusmods,
        Roles: Roles ?? null,
    }

    const stml = userDB.query(
        `INSERT INTO users (
    id, username, globalname, avatar, discordid, theme, style, description, 
    githubusername, nexusmodsusername, nexusmods, github, roles
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
ON CONFLICT(id) DO UPDATE SET
    username = excluded.username,
    globalname = excluded.globalname,
    avatar = excluded.avatar,
    theme = excluded.theme,
    style = excluded.style,
    description = excluded.description,
    githubusername = excluded.githubusername,
    nexusmodsusername = excluded.nexusmodsusername,
    nexusmods = excluded.nexusmods,
    github = excluded.github,
    roles = excluded.roles;

        `
    )

    stml.run(
        object.id ?? null,
        object.username ?? null,
        object.globalname ?? null,
        object.avatar ?? null,
        object.discordid ?? null,
        object.theme ?? null,
        object.style ?? null,
        object.description ?? null,
        object.githubusername ?? null,
        object.nexusmodsusername ?? null,
        object.nexusmods ?? null,
        object.github ?? null,
        JSON.stringify(object.Roles ?? [])
    )

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
