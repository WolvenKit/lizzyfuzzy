import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { TextChannel } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("clear chat")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  const messages = await interaction.channel?.messages.fetch({ limit: 100 });

  if (messages) {
    if (interaction.channel?.isTextBased()) {
      (interaction.channel as TextChannel).bulkDelete(messages);
      interaction.reply({ content: "Chat cleared!", flags: 64 });
    }
  }
}, true, false);
