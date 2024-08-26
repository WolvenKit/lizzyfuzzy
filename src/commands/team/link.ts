import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("link")
  .setDescription("Linking information to the website.")
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
  const info = {
    User: interaction.user.globalName,
    Id: interaction.user.id,
    NexusMods: interaction.options.getString("nexusmods") ?? "None",
    GitHub: interaction.options.getString("github") ?? "None",
    Theme: interaction.options.getString("theme") ?? "default",
    Description: interaction.options.getString("description") ?? "None",
    Style: interaction.options.getString("username") ?? "uppercase",
  };

  const data = fetch(process.env.API_ENDPOINT + "/bot/commands/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BOT_TOKEN}`,
    },
    body: JSON.stringify(info),
  });

  return interaction.reply({ content: JSON.stringify(info, null, 2) });
});
