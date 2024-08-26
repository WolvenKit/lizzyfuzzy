import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new ContextMenuCommandBuilder()
  .setName("Check DDS Format")
  .setType(ApplicationCommandType.Message);

export default command(meta, async ({ interaction }) => {
  if (!interaction.isMessageContextMenuCommand) return;
});
