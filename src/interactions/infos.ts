import {
  SlashCommandBuilder,
  ContainerBuilder,
  MessageFlags,
} from "discord.js";
import { command } from "utils";

import * as infoText from "../resources/infoText";

const meta = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Tips, tricks, and infos.")
  .addStringOption((option) =>
    option
      .setName("info")
      .setDescription("The info to get")
      .setRequired(true)
      .addChoices(
        { name: "Wikis", value: "wiki" },
        { name: "Socials", value: "socials" },
        { name: "Core Mods", value: "coremods" },
        { name: "Rule 3", value: "rulesthree" },
        { name: "Wiki Editing", value: "wikiedit" },
        { name: "Nexus Mods App", value: "nexusmodsapp" },
        { name: "Blender Addon", value: "blenderaddon" },
        { name: "Troubleshooting", value: "throubleshooting" },
        { name: "Core Mods", value: "coremods" },
        { name: "Rule 6", value: "rulesix" },
        { name: "Core Mods", value: "coremods" },
        { name: "Bisect", value: "bisct" },
        { name: "Red4Ext Log", value: "re4log" },
        { name: "Redscript Log", value: "redlog" },
        { name: "CyberEngineTweaks Log", value: "cetlog" }
      )
  );

export default command(meta, async ({ interaction }) => {
  if (interaction.user.bot) return;

  const info = interaction.options.getString("info", true);

  const text = infoText[info as keyof typeof infoText];

  if (!text) {
    return interaction.reply({
      content: "No text found.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const Container = new ContainerBuilder({
    components: [...text],
  });

  return interaction
    .reply({
      flags: [MessageFlags.IsComponentsV2],
      components: [Container],
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      interaction.reply({
        content: "An error occurred while sending the message.",
        ephemeral: true,
      });
    });
});
