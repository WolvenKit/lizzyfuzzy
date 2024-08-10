import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { command } from "utils";
import { App, Octokit } from "octokit";
import fs from "fs";

const key = fs.readFileSync(
  "./src/keys/lizzyfuzzy.2024-08-10.private-key.pem",
  "utf-8"
);

const app = new App({
  appId: 966972,
  privateKey: key,
  auth: {
    id: 966972,
    privateKey: key,
    installationId: 53666733,
  },
  installationId: 53666733,
});

const meta = new SlashCommandBuilder()
  .setName("core-versions")
  .setDescription("Display the core Mods and their latest versions");

export default command(meta, async ({ interaction }) => {
  const octokit = await app.getInstallationOctokit(53666733);
  const RED4ext = await octokit.request(
    "GET /repos/WopsS/RED4ext/releases/latest"
  );
  const ArchiveXL = await octokit.request(
    "GET /repos/psiberx/cp2077-archive-xl/releases/latest"
  );
  const TweakXL = await octokit.request(
    "GET /repos/psiberx/cp2077-tweak-xl/releases/latest"
  );
  const Codeware = await octokit.request(
    "GET /repos/psiberx/cp2077-codeware/releases/latest"
  );
  const cet = await octokit.request(
    "GET /repos/maximegmd/CyberEngineTweaks/releases/latest"
  );
  const redscript = await octokit.request(
    "GET /repos/jac3km4/redscript/releases/latest"
  );

  const embed = new EmbedBuilder()
    .setTitle("Cyberpunk's core mods")
    .setDescription(
      `
## Core mods and frameworks
- [RED4ext - ${RED4ext.data.tag_name}](<https://github.com/WopsS/RED4ext/releases/latest>)
- [ArchiveXL - ${ArchiveXL.data.tag_name} ](<https://github.com/psiberx/cp2077-archive-xl/releases/latest>)
- [TweakXL - ${TweakXL.data.tag_name} ](<https://github.com/psiberx/cp2077-tweak-xl/releases/latest>)
- [Codeware - ${Codeware.data.tag_name} ](<https://github.com/psiberx/cp2077-codeware/releases/latest>)
- [Cyber Engine Tweaks - ${cet.data.tag_name} ](<https://github.com/maximegmd/CyberEngineTweaks/releases/latest>)
- [redscript - ${redscript.data.tag_name} ](<https://github.com/jac3km4/redscript/releases/latest>)

Check [this wiki page](<https://wiki.redmodding.org/cyberpunk-2077-modding/modding-know-how/frameworks>) for more information.`
    )
    .setColor("#FF0000");

  return interaction.reply({ embeds: [embed] });
});
