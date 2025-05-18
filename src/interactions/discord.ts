import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("discord")
  .setDescription("Send the Discord invite link via DM");

export default command(meta, async ({ interaction }) => {
  const text =
    "Cyberpunk 2077 Modding Discord: https://discord.gg/redmodding\nOfficial";

  await interaction.user.send(text);
  return await interaction.reply("Send! Check your DMs!");
});
