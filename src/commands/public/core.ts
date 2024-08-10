import { SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("core-versions")
  .setDescription("Display the core Mods and their latest versions");

export default command(meta, async ({ interaction }) => {
  return interaction.reply({
    content: "This command is not yet implemented",
    ephemeral: true,
  });
});
