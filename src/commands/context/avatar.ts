import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import type { UserContextMenuCommandInteraction } from "discord.js";
import { command } from "utils";
const meta = new ContextMenuCommandBuilder()
  .setName("Get Avatar")
  .setType(ApplicationCommandType.User);

export default command(meta, async ({ interaction }) => {
  if ( !interaction.isUserContextMenuCommand ) return;
  const Interaction = interaction as unknown as UserContextMenuCommandInteraction;

  interaction.reply({
    content: Interaction.targetUser.displayAvatarURL(),
    ephemeral: false,
  });
});
