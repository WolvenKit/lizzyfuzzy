import { SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("core-versions")
  .setDescription("Display the core Mods and their latest versions");

export default command(meta, async ({ interaction }) => {
  const data = await fetch(
    process.env.API_ENDPOINT + "/bot/commands/core-versions",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.BOT_TOKEN}`,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  const embed = [
    {
      title: "Core mods and frameworks",
      description: `
  The core mods are required for many other mods to function at all. They are version-dependent and will not work with older versions of the game.
  If any of your mods depend on one of the following, make sure to always keep these dependencies up-to-date:

  ●  [RED4ext - ${data.red4ext.tag_name}](<https://github.com/WopsS/RED4ext/releases/latest>)
  ●  [ArchiveXL - ${data.archivexl.tag_name} ](<https://github.com/psiberx/cp2077-archive-xl/releases/latest>)
  ●  [TweakXL - ${data.tweakxl.tag_name} ](<https://github.com/psiberx/cp2077-tweak-xl/releases/latest>)
  ●  [Codeware - ${data.codeware.tag_name} ](<https://github.com/psiberx/cp2077-codeware/releases/latest>)
  ●  [Cyber Engine Tweaks - ${data.cet.tag_name} ](<https://github.com/maximegmd/CyberEngineTweaks/releases/latest>)
  ●  [redscript - ${data.redscript.tag_name} ](<https://github.com/jac3km4/redscript/releases/latest>)

  Check [this wiki page](<https://wiki.redmodding.org/cyberpunk-2077-modding/modding-know-how/frameworks>) for more information.`,
      color: 16711680,
    },
  ];

  return interaction.reply({ embeds: embed });
});
