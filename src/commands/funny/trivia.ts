import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command, getRandomTrivia } from "utils";

const meta = new SlashCommandBuilder()
  .setName("trivia")
  .setDescription("Trivia")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  await interaction.reply("Do you want to play trivia?");

  const collectorFilter = (m: any) => m.author.id === interaction.user.id;
  const collector = interaction.channel?.createMessageCollector({
    filter: collectorFilter,
    time: 15000,
  });

  const randomTrivia = await getRandomTrivia();

  collector?.on("collect", async (m) => {
    if (m.content.toLowerCase() === "yes") {
      await interaction.editReply("Great! Let's start the game!");
      await interaction.followUp(randomTrivia.question);

      const collectorFilter = (m: any) => m.author.id === interaction.user.id;
      const collector = interaction.channel?.createMessageCollector({
        filter: collectorFilter,
        time: 15000,
      });

      collector?.on("collect", async (m) => {
        if (m.content.toLowerCase() === randomTrivia.answer) {
          await interaction.editReply("Correct!");
        } else {
          await interaction.editReply("Incorrect!");
        }
      });

      collector?.on("end", async (collected) => {
        if (collected.size === 0) {
          await interaction.editReply("Time's up!");
        }
      });
    } else {
      await interaction.editReply("Maybe next time!");
    }
  });
});
