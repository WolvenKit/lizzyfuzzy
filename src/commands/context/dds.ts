import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import type { MessageContextMenuCommandInteraction } from "discord.js";
import { command } from "../../utils";

const meta = new ContextMenuCommandBuilder()
  .setName("Check DDS Format")
  .setType(ApplicationCommandType.Message);

export default command(meta, async ({ interaction }) => {
    if (!interaction.isMessageContextMenuCommand) return;

    const Interaction =
      interaction as unknown as MessageContextMenuCommandInteraction;
  
  interaction.reply({ content: "Hello from DDS!", ephemeral: false });
});
