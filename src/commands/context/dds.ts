import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import { command } from "utils";
import client from "prom-client";

const gauge = new client.Counter({
  name: "context_dds_usage",
  help: "Usage of the dds context command",
});

const meta = new ContextMenuCommandBuilder()
  .setName("Check DDS Format")
  .setType(ApplicationCommandType.Message);

export default command(meta, async ({ interaction }) => {
  if (!interaction.isMessageContextMenuCommand) return;
  gauge.inc(1);

});
