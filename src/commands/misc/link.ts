import {
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { command } from "../../utils";

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
    User: interaction.user,
    NexusMods: interaction.options.getString("nexusmods"),
    GitHub: interaction.options.getString("github"),
    Theme: interaction.options.getString("theme"),
    Description: interaction.options.getString("description"),
  };

  interaction.reply({
    content: JSON.stringify(info, null, 2),
    ephemeral: true,
  });
});
