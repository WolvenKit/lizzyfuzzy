import {
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { command } from "utils";


const meta = new SlashCommandBuilder()
  .setName("team")
  .setDescription("dev command")
  
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  if (interaction.user.bot) return;

  switch (interaction.options.getSubcommand()) {
    
  }
});
