import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { command } from "utils";
import client from "prom-client";

const gauge = new client.Counter({
  name: "command_who_usage",
  help: "Usage of the who command",
});

const meta = new SlashCommandBuilder()
  .setName("who")
  .setDescription("Provides information about the user.")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("The user to provide information about.")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  gauge.inc(1);
  const target = interaction.options.getUser("target");

  if (target) {
    const guildMember = interaction.guild?.members.fetch(target.id);
    const guildMemberData = await guildMember;

    if (guildMemberData) {
      const whoEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setAuthor({
          name: guildMemberData.user.tag,
          iconURL: target.displayAvatarURL(),
        })
        .setThumbnail(target.displayAvatarURL())
        .addFields(
          {
            name: "Joined",
            value: `${guildMemberData.joinedAt}`,
            inline: true,
          },
          {
            name: "Created",
            value: `${guildMemberData.user.createdAt}`,
            inline: true,
          },
          {
            name: "Voice State",
            value: `${guildMemberData.voice.channelId}`,
            inline: true,
          },
          {
            name: "Roles",
            value: `${guildMemberData.roles.cache.map((role) => role.name)}`,
          },
          {
            name: "Permissions",
            value: `${guildMemberData.permissions
              .toArray()
              .toString()
              .replace(/,/g, ", ")}`,
          }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [whoEmbed] });
    }
  }
});
