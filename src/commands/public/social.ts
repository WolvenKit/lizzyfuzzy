import { SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("social")
  .setDescription("Display the current Socials from Red Modding");

export default command(meta, async ({ interaction }) => {
  return interaction.reply({
    content: "This command is not yet implemented",
    ephemeral: true,
  });
});
