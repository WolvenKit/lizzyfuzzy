import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";
import { prisma } from "src";

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
  const info = {
    User: interaction.user.globalName,
    Id: interaction.user.id,
    NexusMods: interaction.options.getString("nexusmods") || "None",
    GitHub: interaction.options.getString("github") || "None",
    Theme: interaction.options.getString("theme") || "default",
    Description: interaction.options.getString("description") || "None",
  };

  const upsert = await prisma.user.upsert({
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

  console.log(upsert);

  interaction.reply({
    content: JSON.stringify(info, null, 2),
    ephemeral: true,
  });
});
