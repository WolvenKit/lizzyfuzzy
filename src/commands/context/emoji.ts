import { ApplicationCommandType, ContextMenuCommandBuilder } from "discord.js";
import type { MessageContextMenuCommandInteraction } from "discord.js";
import { command } from "../../utils";

const meta = new ContextMenuCommandBuilder()
  .setName("Get Single Emoji")
  .setType(ApplicationCommandType.Message);

export default command(meta, async ({ interaction }) => {
  if (!interaction.isMessageContextMenuCommand) return;

  const Interaction =
    interaction as unknown as MessageContextMenuCommandInteraction;

  //   const match = Interaction.targetMessage?.content.match(/\d+/g);
  const match = Interaction.targetMessage?.content.match(
    /(<:|<a:)([a-zA-Z]+)(:)(\d+)(>)/
  );

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
