import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("create")
  .setDescription("Create data for the Database!")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand((subcommand) =>
    subcommand
      .setName("trivia")
      .setDescription("Create a trivia question and answer")
      .addStringOption((option) =>
        option.setName("question").setDescription("Question").setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("answer").setDescription("Answer").setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("response")
      .setDescription("Create a response")
      .addStringOption((option) =>
        option
          .setName("quote")
          .setDescription("The quote itself")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("responder")
          .setDescription("Who can trigger the quote. Default is everyone.")
          .setRequired(false)
      )
  );

export default command(meta, async ({ interaction }) => {
  const subcommand = interaction.options.getSubcommand();

  const question = interaction.options.getString("question")!.replace('\\n','\n');
  const answer = interaction.options.getString("answer")!.replace('\\n','\n');

  const quote = interaction.options.getString("quote")!.replace('\\n','\n');
  const responder = interaction.options.getString("responder")!.replace('\\n','\n');

  if (subcommand === "trivia") {
    if (!question || !answer) {
      await interaction.reply("Question and answer are required!");
      return;
    }

    const trivia = {
      question,
      answer,
    };

    const data = await fetch(
      process.env.API_ENDPOINT + "/bot/commands/trivia",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.BOT_TOKEN}`,
        },
        body: JSON.stringify(trivia),
      }
    );

    return await interaction.reply({
      content:
        "Trivia created with data:\nQuestion: " +
        "```" +
        trivia.question +
        "```" +
        "\nAnswer: " +
        "```" +
        trivia.answer +
        "```",
      ephemeral: true,
    });
  }

  if (subcommand === "response") {
    if (!quote) {
      await interaction.reply("Quote is required!");
      return;
    }

    const response = {
      quote,
      responder: responder || "everyone",
    };

    const data = await fetch(
      process.env.API_ENDPOINT + "/bot/commands/quotes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${process.env.BOT_TOKEN}`,
        },
        body: JSON.stringify(response),
      }
    );


    return await interaction.reply({
      content:
        "Response created with data: " +
        "```" +
        response.quote +
        "```" +
        "\nResponder: " +
        "```" +
        response.responder +
        "```",
      ephemeral: true,
    });
  }

  return await interaction.reply({
    content: "Data created!",
    ephemeral: true,
  });
});
