import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  ContainerBuilder,
  MessageFlags,
} from "discord.js";
import { command } from "utils";

import joinmsg from "../fallback/joinmsg";

const meta = new SlashCommandBuilder()
  .setName("component")
  .setDescription("dev command")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(
  meta,
  async ({ interaction }) => {
    if (interaction.user.bot) return;

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
);
