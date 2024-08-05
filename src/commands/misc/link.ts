import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { command } from "../../utils";
import { prisma } from "src";

import client from "prom-client";

const gauge = new client.Counter({
  name: "command_link_usage",
  help: "Usage of the link command",
});

const meta = new SlashCommandBuilder()
  .setName("link")
  .setDescription("Linking information to the website.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((option) =>
    option
      .setName("nexusmods")
      .setDescription("NexusMods Username")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("github").setDescription("GitHub Username").setRequired(true)
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
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("description")
      .setDescription("Short description about yourself")
      .setMaxLength(2012)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  gauge.inc(1);
  const info = {
    User: interaction.user.globalName,
    Id: interaction.user.id,
    NexusMods: interaction.options.getString("nexusmods") ?? "None",
    GitHub: interaction.options.getString("github") ?? "None",
    Theme: interaction.options.getString("theme") ?? "default",
    Description: interaction.options.getString("description") ?? "None",
  };

  await prisma.user.upsert({
    where: {
      userid: interaction.user.id,
    },
    update: {
      userid: interaction.user.id,
      user: interaction.user.username,
      nexusmods: info.NexusMods,
      github: info.GitHub,
      theme: info.Theme,
      description: info.Description,
    },
    create: {
      userid: interaction.user.id,
      user: interaction.user.username,
      nexusmods: info.NexusMods,
      github: info.GitHub,
      theme: info.Theme,
      description: info.Description,
    },
  });

  interaction.reply({
    embeds: [
      new EmbedBuilder().addFields(
        {
          name: "NexusMods",
          value: info.NexusMods,
          inline: true,
        },
        {
          name: "GitHub",
          value: info.GitHub,
          inline: true,
        },
        {
          name: "Theme",
          value: info.Theme,
          inline: true,
        },
        {
          name: "Description",
          value: info.Description,
          inline: true,
        }
      ),
    ],
    ephemeral: true,
  });
});
