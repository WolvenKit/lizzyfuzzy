import type { ChatInputCommandInteraction } from "discord.js";
import { ContainerBuilder, MessageFlags } from "discord.js";

import joinmsg from "../../fallback/joinmsg";

export default async function Component(interaction: ChatInputCommandInteraction) {
  const Container = new ContainerBuilder({
    components: joinmsg,
  });

  interaction
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
}
