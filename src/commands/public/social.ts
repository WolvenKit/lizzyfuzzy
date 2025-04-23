import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("social")
  .setDescription("Display the current Socials from Red Modding");

export default command(
  meta,
  async ({ interaction }) => {
    const embed = new EmbedBuilder()
      .setTitle("Socials")
      .setDescription("Here are the current Socials from Red Modding")
      .addFields([
        { name: "Github", value: "https://github.com/WolvenKit" },
        { name: "YouTube", value: "https://www.youtube.com/@wolvenkit" },
        { name: "Twitch", value: "https://www.twitch.tv/redmodding" },
        { name: "Discord", value: "https://discord.gg/redmodding" },
      ])
      .setColor("#FF0000");

    await interaction.reply({ embeds: [embed] });
  },
  false,
  false
);
