import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { GuildMemberRoleManager } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("link")
  .setDescription("Linking information to the website. V2")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((option) =>
    option
      .setName("nexusmods")
      .setDescription("NexusMods Username")
      .setMaxLength(20)
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("github")
      .setDescription("GitHub Username")
      .setMaxLength(20)
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("theme")
      .setDescription("Choose you profile theme")
      .addChoices(
        { name: "Default", value: "default" },
        { name: "Cyberpunk", value: "cyberpunk" },
        { name: "Witcher", value: "witcher" }
      )
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("Short description about yourself")
      .setMaxLength(2012)
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName("username")
      .addChoices(
        { name: "Uppercase", value: "uppercase" },
        { name: "Lowercase", value: "lowercase" }
      )
      .setDescription("Choose your username style")
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {

  const Roles = interaction.member ? (interaction.member.roles as GuildMemberRoleManager).cache.map((role) => {
    return {
      id: role.id,
      name: role.name,
      position: role.position,
      rawPosition: role.rawPosition,
      icon: role.icon,
      iconUrl: role.iconURL(),
    }
  }) : [];

  const data = await fetch(
    process.env.API_ENDPOINT + "/bot",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.BOT_TOKEN}`,
      },
      body: JSON.stringify({
        server: interaction.guild?.id,
        id: interaction.user.id,
        user: interaction.user.username ?? null,
        globalname: interaction.user.globalName ?? null,
        image: interaction.user.displayAvatarURL(),
        nexusmods: interaction.options.getString("nexusmods") ?? null,
        github: interaction.options.getString("github") ?? null,
        theme: interaction.options.getString("theme") ?? null,
        description: interaction.options.getString("description") ?? null,
        namestyle: interaction.options.getString("username") ?? null,
        Roles: Roles ?? null,
      }),
    }
  );

  if (!data.ok) {
    return interaction.reply({
      content: "Failed to link your account.",
      ephemeral: true,
    });
  }

  return interaction.reply({
    embeds: [
      {
        title: "Account Linked",
        description: "Your account has been successfully linked/Updated.",
        color: 0x00ff00,
      },
    ],
    ephemeral: true,
  });
}, true, false);
