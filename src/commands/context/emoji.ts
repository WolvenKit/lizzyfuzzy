import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import type { MessageContextMenuCommandInteraction } from "discord.js";
import { command } from "utils";

const meta = new ContextMenuCommandBuilder()
  .setName("Get Single Emoji")
  .setType(ApplicationCommandType.Message);

export default command(meta, async ({ interaction }) => {
  if (!interaction.isMessageContextMenuCommand) return;

  const Interaction =
    interaction as unknown as MessageContextMenuCommandInteraction;

  const emojiRegex = /(<:|<a:)([a-zA-Z]+)(:)(\d+)(>)/;
  const match = emojiRegex.exec(Interaction.targetMessage?.content || "");

  if (match?.[1] === "<a:") {
    interaction.reply({
      content: `https://cdn.discordapp.com/emojis/${match?.[4]}.gif`,
    });
  } else if (match?.[1] === "<:") {
    interaction.reply({
      content: `https://cdn.discordapp.com/emojis/${match?.[4]}.webp`,
    });
  }

  interaction.reply({
    content: "No or more than one emoji found",
    flags: 64,
  });
});
