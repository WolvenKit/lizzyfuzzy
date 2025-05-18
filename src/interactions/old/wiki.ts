import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("wiki")
  .setDescription("Get links to the Red Modding Wiki");

export default command(meta, async ({ interaction }) => {
  const embed = new EmbedBuilder()
    .setTitle("RedModding Wikis")
    .setDescription("Here are the current links to the Red Modding Wiki")
    .setDescription(
      `
- [Wiki](https://wiki.redmodding.org) 
- [Cyberpunk Modding](https://wiki.redmodding.org/cyberpunk-2077-modding) 
- [WolvenKit](https://wiki.redmodding.org/wolvenkit) 
- [REDmod](https://wiki.redmodding.org/cyberpunk-2077-modding/modding/redmod) 
- [RED4ext](https://wiki.redmodding.org/red4ext/) 
- [Redscript](https://wiki.redmodding.org/redscript/) 
- [CyberEngineTweaks](https://wiki.redmodding.org/cyber-engine-tweaks/) 
- [Shared Knowledge](https://wiki.redmodding.org/script) 
      `
    )
    .setColor("#FF0000");

  await interaction.reply({ embeds: [embed] });
});
