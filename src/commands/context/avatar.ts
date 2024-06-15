import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { command } from "../../utils";

const meta = new ContextMenuCommandBuilder()
  .setName("Get Avatar")
  .setType(ApplicationCommandType.User);

export default command(meta, async ({ interaction }) => {
  interaction.reply({
    content: interaction.user.displayAvatarURL(),
    ephemeral: false,
  });
});
