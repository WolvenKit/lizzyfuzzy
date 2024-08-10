import { SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("wiki")
  .setDescription("Get links to the Red Modding Wiki");

export default command(meta, async ({ interaction }) => {
  return interaction.reply({
    content: "This command is not yet implemented",
    ephemeral: true,
  });
});
