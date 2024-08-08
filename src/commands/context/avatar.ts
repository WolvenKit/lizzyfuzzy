import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import type { UserContextMenuCommandInteraction } from "discord.js";
import { command } from "utils";
import client from "prom-client";

const gauge = new client.Counter({
  name: "context_avatar_usage",
  help: "Usage of the avatar context command",
});

const meta = new ContextMenuCommandBuilder()
  .setName("Get Avatar")
  .setType(ApplicationCommandType.User);

export default command(meta, async ({ interaction }) => {
  if ( !interaction.isUserContextMenuCommand ) return;
  gauge.inc(1);
  const Interaction = interaction as unknown as UserContextMenuCommandInteraction;

  interaction.reply({
    content: Interaction.targetUser.displayAvatarURL(),
    ephemeral: false,
  });
});
