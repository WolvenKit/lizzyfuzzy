import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("create")
  .setDescription("Create data for the Database!")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand((subcommand) =>
    subcommand
      .setName("quote")
      .setDescription("Create a quote for the bot to respond to")

      .addStringOption((option) =>
        option
          .setName("string")
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
  try {
    const Quote = interaction.options.getString("quote", true);
    const Responder = interaction.options.getString("responder", false);

    const response = {
      Quote,
      Responder: Responder || "everyone",
    };

    const newQuote = await fetch(process.env.API_ENDPOINT + "/bot/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(response),
    }).then((res) => res.json());

    return interaction.reply({
      content: `Quote created! With ID: ${newQuote.GlobalId}`,
      flags: 64,
    });
  } catch (e) {
    return interaction.reply({
      content: "Failed to create quote",
      flags: 64,
    });
  }
});
