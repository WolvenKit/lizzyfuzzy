import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import type { MessageContextMenuCommandInteraction } from "discord.js";
import { command } from "../../utils";
import client from "prom-client";

const gauge = new client.Counter({
  name: "context_emoji_usage",
  help: "Usage of the emoji context command",
});

const meta = new ContextMenuCommandBuilder()
  .setName("Get Single Emoji")
  .setType(ApplicationCommandType.Message);

export default command(meta, async ({ interaction }) => {
  if (!interaction.isMessageContextMenuCommand) return;
  gauge.inc(1);

  const Interaction =
    interaction as unknown as MessageContextMenuCommandInteraction;

  const emojiRegex = /(<:|<a:)([a-zA-Z]+)(:)(\d+)(>)/;
  const match = emojiRegex.exec(Interaction.targetMessage?.content || "");

  console.log(match);

  if (match?.[1] === "<a:") {
    interaction.reply({
      content: `https://cdn.discordapp.com/emojis/${match?.[4]}.gif`,
      ephemeral: false,
    });
  } else if (match?.[1] === "<:") {
    interaction.reply({
      content: `https://cdn.discordapp.com/emojis/${match?.[4]}.webp`,
      ephemeral: false,
    });
  }

  interaction.reply({
    content: "No or more than one emoji found",
    ephemeral: true,
  });
});
