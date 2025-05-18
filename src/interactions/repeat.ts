import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("repeat")
  .setDescription("dev")
  .addStringOption((option) =>
    option.setName("text").setDescription("text").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction }) => {
  const text = interaction.options.getString("text")!.replace("\\n", "\n");

  return interaction.reply(text);
});
