import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";
import type { TextChannel } from "discord.js";

const meta = new SlashCommandBuilder()
  .setName("component")
  .setDescription("dev command")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(
  meta,
  async ({ interaction }) => {
    const channelId = "1335254522733531156";
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({
        content: "Guild not found.",
        ephemeral: true,
      });
    }
    const channel = await guild.channels.fetch(channelId);
    if (!channel || channel.type !== 0) {
      return interaction.reply({
        content: "Text channel not found.",
        ephemeral: true,
      });
    }
    (channel as TextChannel).send({
      flags: 1 << 15,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Click me",
              style: 1,
              custom_id: "button_click",
            },
          ],
        },
      ],
    });
  },
  true,
  true
);
