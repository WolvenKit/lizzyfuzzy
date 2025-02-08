import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "utils";

const meta = new SlashCommandBuilder()
  .setName("create_quote")
  .setDescription("Create data for the Database!")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addStringOption((option) =>
    option.setName("quote").setDescription("The quote itself").setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("responder")
      .setDescription("Who can trigger the quote. Default is everyone.")
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  try {
    const quote = interaction.options.getString("quote", true);
    const responder = interaction.options.getString("responder", false);

    const response = {
      quote,
      responder: responder || "everyone",
    };

    await fetch(process.env.API_ENDPOINT + "/bot/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.BOT_TOKEN}`,
      },
      body: JSON.stringify(response),
    });

    return interaction.reply({
      content: "Quote created!",
      flags: 64,
    });
  } catch (e) {
    console.error(e);
    return interaction.reply({
      content: "Failed to create quote",
      flags: 64,
    });
  }
});
