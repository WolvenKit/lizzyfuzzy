import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command, createTrivia } from "utils";

const meta = new SlashCommandBuilder()
  .setName("trivia-create")
  .setDescription("Create trivia question and answer")
  .addStringOption((option) =>
    option.setName("question").setDescription("Question").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("answer").setDescription("Answer").setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export default command(meta, async ({ interaction, client }) => {
  const question = interaction.options.getString("question");
  const answer = interaction.options.getString("answer");

  if (!question || !answer) {
    await interaction.reply("Question and answer are required!");
    return;
  }

  const trivia = {
    question,
    answer,
  };

  await createTrivia(trivia.question, trivia.answer);
  await interaction.reply("Trivia created!");
});
