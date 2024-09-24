import { SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("auth")
  .setDescription("Authenticates the user with the bot");

export default command(meta, async ({ interaction }) => {
  return await interaction.reply("Send!");
});
